---
title: "Using a Fujifilm Camera as a Webcam"
date: 2023-05-24T22:07:46+01:00
tags:
  - fujfilm
  - xt4
  - video
  - webcam
categories:
  - tools
  - photography
author: shekhar
layout: layouts/post.njk
---
### How to use your XT1/2/3/4 fujifilm camera as webcam for your ubuntu 22.04.

This is a simple guide to use your fujifilm camera as a webcam.


### Installation:

```shell script
sudo apt-get install gphoto2 v4l2loopback-utils v4l2loopback-dkms ffmpeg
```

modprobe setup

```shell script

sudo modprobe -r v4l2loopback
sudo modprobe v4l2loopback exclusive_caps=1 max_buffers=2 
```

check video sources

```shell script
ls -l /dev/video* 
```

Make sure there is no gphoto process already running:

```shell script
ps aux | grep gphoto 
```

check is camera is detected by gphoto2:

```shell scipt
gphoto2 --auto-detect 
```

start the webcam

```shell script
gphoto2 --stdout --capture-movie | ffmpeg -i - -vcodec rawvideo -pix_fmt yuv420p -threads 0 -f v4l2 /dev/video2 
```

Note: Huge thanks to : 
https://medium.com/nerdery/dslr-webcam-setup-for-linux-9b6d1b79ae22

