---
title: "AWS Lambda for Data Scientists using Python"
date: 2020-06-11T14:35:28+05:45
tags:
  - Blog
categories:
  - aws
  - python
author: shekhar
layout: layouts/post.njk
---

## Introduction
The post is a quick guide on "How we could use AWS lambda services to deploy some standalone task". This is really helpful when we dont have to buy instances for such task. By using word task, I mean scripts, that could scrap data, or a cron job data aggregator. The BEST thing about the cron job is that , it is way cheaper. A million hits by lambda function is Free in AWS. 
<!--more-->
The following steps could lets you get going. In this example below, I am aggregating data in MongoDB and store the output in Redis. 

### Step 1 function creating
Create function : [https://console.aws.amazon.com/lambda/home?region=us-east-1](https://console.aws.amazon.com/lambda/home?region=us-east-1)
One has to login to the AWS console and create a lambda function. 
Think Lambda function as a task that we want to do here. 

To run a function , we need a script. Lets say : `lambda_function.py` 
The script wont run until it mets all its dependency. In Data Science world, pandas , numpy etc.
We need to provide all the Dependency a script it requires. 

### Step 2 Dependencies
For managing the Dependencies : we could looked at the official Documentation. [https://docs.aws.amazon.com/lambda/latest/dg/python-package.html](https://docs.aws.amazon.com/lambda/latest/dg/python-package.html)
In short: We want to dump all the dependencies in a folder. 

```shell script
pip install --target ./package redis
pip install --target ./package sentry_sdk
pip install --target ./package motor
```

Yeah, I didnt include pandas, numpy and scipy. Because that is different case. 
The AWS lambda works in different version of linux which doesnt support the pypi installation of pandas and numpy. As those libraries extensibly use cython for optimization. 

To use such Libraries, we will get to the new concept of Lmbda function ie : `LAYERS`

### step 3: the code
Make your code ready, especially the Beginning and the end. 
Most of the standard python use `config.ini` or `.env` file to get the variables value. Change that to `os.environ.gte()` function. 
```python
import motor.motor_asyncio
import asyncio
from datetime import datetime, timedelta
import os
import pandas as pd
import sentry_sdk
import redis
import json


class TrendingAggregator:
    def __init__(self):
        sentry_url = os.environ.get("default", "sentry_url")
        sentry_env = os.environ.get("default", "sentry_env")
```
Similarly, at the end of the code. 
```python
def lambda_handler(event, context):
    trending = TrendingAggregator()
    trending.process()
``` 
You could change the function name `lambda_handler` and the filename   `lambda_function.py`
but it requires you to change the name in AWS lambda function console too. So, for sake of lazyness, lets stick to the default naming. 

### Step 4: shipment
Make the shipment ready. 
```shell script
~/my-function$ cd package
~/my-function/package$ zip -r9 ${OLDPWD}/function.zip .

$ cd ..
$  zip -g function.zip lambda_function.py
```

Here, what we did is , we zipped the packages [ dependencies ]  and then add our script to the `function.zip` file. 

### Step 5: layers ?
You could see `Function code`, when you scroll down in the lambda dunction page in your AWS console  , and `Actions` box, where one get options like `upload a .zip file` or `upload a file from Amazon S3`
Once you upload your zip file.  You will see your code [ unless your code is more that 10 MB ]

There you could save and test the code. 
But since you need more complex dependencies You need to know little mroe about layers. 

### Step 5 : yeah, the layers.
Layers:
If your code depends on AWS lambda function layers, you could do Three things to solve this. 
link to add layer to your lambda function [https://console.aws.amazon.com/lambda/home?region=us-east-1#/add/layer?function=trending_aggregator](https://console.aws.amazon.com/lambda/home?region=us-east-1#/add/layer?function=trending_aggregator)
Note: `trending-aggregator` is my function name. 

##### use standard layer
more info [https://aws.amazon.com/blogs/aws/new-for-aws-lambda-use-any-programming-language-and-share-common-components/](https://aws.amazon.com/blogs/aws/new-for-aws-lambda-use-any-programming-language-and-share-common-components/)
its easy, its provided by AWS ( safe )

One could select `Select from list of runtime compatible layers` when they are in their layer page and see the AWS standard layer name. 
`AWSLambda-Python6-SciPy1x`

##### use someone else layer
yeah, well, whatever you gonna do, someone had already done it may be 5 years ago. So, you could use their layer. Until you have their layer code. 
Luckily someone shares the detail in a stackoverfflow question. Cheers.
more info [https://stackoverflow.com/questions/36054976/pandas-aws-lambda](https://stackoverflow.com/questions/36054976/pandas-aws-lambda)
One could select `Provide a layer version ARN` in their layer page. 
and add this arn code `arn:aws:lambda:us-east-1:113088814899:layer:Klayers-python37-pandas:1` BOOM , Thanks Mate. 

##### use your own layer
Security Issues ?, To create our own layer , we need another AWS machine ( EC2).
Login to another EC2 machine and follow these steps:

```shell script
python --version
Python 3.6.8

# https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html
# python 3.6 uses Amazon Linux currently 

mkdir project
cd project
virtualenv v-env
source ./v-env/bin/activate
pip install pandas
deactivate

# creating layer
# https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html#configuration-layers-path
mkdir python
cd python


cp -r ../v-env/lib/python3.6/site-packages/* .
cd ..
zip -r panda_layer.zip python
```
This will create a zip file which include pandas , as installed natively in a weird AWS machine. 

```shell script
ubuntu@ip:~/project$ cd ~/.aws/
ubuntu@ip:~/.aws$ ls
config  credentials  credentials_prod
ubuntu@ip:~/.aws$ cp credentials credentials_dev
ubuntu@ip:~/.aws$ aws configure
AWS Access Key ID [****************VF5Q]: *********AWS Id ************
AWS Secret Access Key [****************hco4]: *********AWS access key ************
Default region name [us-east-1]:
Default output format [json]:
```
Here, we make our AWS credential compatible. 
Now we have a zip containing dependency and our AWS account is connected. As suggested by one stackoverflow answer. 
```shell script

aws lambda publish-layer-version --layer-name pandas --zip-file fileb://panda_layer.zip --compatible-runtimes python3.6
```
But it didnt, so Our DevOps engineer finds a hack to deploy this as a layer. 
We first push the zip file to a S3 bucket and then publish the layer from there. 
```shell script
aws s3 cp layer.zip s3://{{bucket_name}}/layer.zip
aws lambda publish-layer-version --layer-name my-layer --description "My layer" --license-info "MIT" --content S3Bucket={{bucket-name}},S3Key=layer.zip --compatible-runtimes python3.6 python3.7 python3.8
```

yeah, owning one own layer is hard, But we already have two other alternatives. 

### Step 6 RUNNNN
Run, 
you could test the model, some database dependency like redis and mongodb should be abale to communicate with AWS lambda otherwise it wont work. 
But Once you do that, it will surely work and you will see the bueaty. 

```shell script
REPORT RequestId: 5b9ce656-c38c-43c8-9187-515872598c61	Duration: 3003.21 ms	Billed Duration: 3000 ms	Memory Size: 192 MB	Max Memory Used: 142 MB	Init Duration: 2202.47 ms	
```

You will only get billed for the time you ran for. 
You could limit the resources, see Memory size and Max Memory used. 


I hope the stats are convincing enough to adopt Lambda function instead a buying bulky Instances.


