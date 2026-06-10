---
title: Setting up Nvidia SDK Manager and Torch Library in Jetson Board
date: 2024-08-19T13:37:53+01:00
description: Learn how to setup Nvidia SDK Manager to install latest jetpack in
  jetson development boards like Orion AGX, Nano Xavier. This blog also extent
  to setup tensorrt and do benchmark over existing Pytorch Model
tags:
  - Nvidia
  - CUDA
  - Nvidia SDK Manager
  - Jetson
  - pyenv
  - poetry
  - tensorrt
  - benchmark
categories:
  - Installation
  - Nvidia
author: shekhar
cover: /images/jetpack-nvidia-jetson.jpeg
layout: layouts/post.njk
---

The blog serves as a backup for setting up the Nvidia Jetson Orion AGX for Development/Production.
Please note: review all the steps before proceeding.

I was updating from JetPack 5.x to 6.x. My Jetson Orion AGX had already been flashed.

# Installation
The blog covers installing the [Nvidia sdk manager](https://developer.nvidia.com/sdk-manager).
Make sure to install Ubuntu 22.04, not 24.04, for installing JetPack 6 (as of August 19, 2024).
Similarly, upgrade the host machine, install all the necessary Nvidia drivers and CUDA on the host machine before installing the Nvidia SDK Manager. More information on installing [Nvidia Drivers on ubuntu](https://shekharkoirala.com.np/posts/nvidia_cuda12_ubuntu/)



## Prerequistics 
It is also advisable to review the dedicated [developer kit user guide](https://developer.nvidia.com/embedded/learn/jetson-agx-orin-devkit-user-guide/index.html#about-this-document)
Go over Jetson Zoo and check for package versions if needed: [ZOO](https://elinux.org/Jetson_Zoo)


## Prepare the Nvidia Jetson Device
Once you log into the Nvidia SDK Manager, you can't verify the target board.
To do that, follow these steps:

1. Connect the USB Type-C port located above the power jack to the power source.
2. Connect the Type-C port located beside the GPIO pins to the host computer.
3. Connect the Micro-USB [UART] port located beside the HDMI pins to the host computer.

After this, make sure you boot the Nvidia Jetson in recovery mode. You can put the device in recovery mode in two ways:

1. Press the middle button (between power and restart) and the restart button together, then release them together.
[This step didn't work for me.]

2. Turn on the Nvidia Jetson machine, open the terminal, and type:
```bash
sudo reboot --force forced-recovery
```

After this the nvidia board will be seen in the Nvidia SDK Manager. You can also check it via command in host machine. 
```bash
lsusb
```

## Nvidia SDK Manager

Once the target board is detected, select the drive location where you want to download the necessary files.
Then, a prompt will appear to flash the board. Flash your board by selecting the eMMC drive.
Once the flash process is completed, it will prompt you to proceed with the installation of the Nvidia SDK Manager.
However, I encountered an issue where it wouldn't allow me to install everything.

Here’s a workaround: Open the terminal on the freshly flashed Nvidia board.

Connect to Wi-Fi, because the flashed Nvidia board functions like a new computer. Install the necessary software and drivers to proceed.

```bash
sudo apt update && sudo apt upgrade
sudo apt dist-upgrade
sudo apt install -y make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
sudo apt install python3-pip
sudo apt install nvidia-jetpack
```

And now, voila! You have the latest version of Nvidia Jetson.

## Installing python packages. 

Installing Python packages, including Poetry, can be tricky because TensorRT is installed in the system. To use it, you need to run the following command:

```bash
poetry config virtualenvs.options.system-site-packages true 
```

Yes, TensorRT is included in JetPack. You can verify its installation using the following command:

```bash
sudo apt-get install tensorrt nvidia-tensorrt-dev python3-libnvinfer-dev
```

Next, install Torch, TorchVision, and ONNX Runtime.
```bash
wget https://nvidia.box.com/shared/static/mp164asf3sceb570wvjsrezk1p4ftj8t.whl -O torch-2.3.0-cp310-cp310m-linux_aarch64.whl
pip install torch-2.3.0-cp310-cp310m-linux_aarch64.whl
```

for the wheel file url check this.
1. [forum posts](https://forums.developer.nvidia.com/t/pytorch-for-jetson/72048) , found both torch and torchvision, but might not update later.
2. [jetson zoo](https://elinux.org/Jetson_Zoo) I didn't torch here
3. [jetson distribution](https://developer.download.nvidia.com/compute/redist/jp/) only found torch not torchvision.

Yes, it’s a bit of a mess, but it works. We don’t have much flexibility with the Torch version—we have to use whatever Nvidia provides for the JetPack versions.


## Benchmarking. 

Now, use the script to benchmark the speed of Torch and TensorRT.

```python
import torch
import onnx
import onnx_tensorrt.backend as backend
import tensorrt as trt
import time
import numpy as np

# Define a simple PyTorch model
class MyModel(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = torch.nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1)
        self.relu1 = torch.nn.ReLU()
        self.conv2 = torch.nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1)
        self.relu2 = torch.nn.ReLU()
        self.pool = torch.nn.MaxPool2d(kernel_size=2, stride=2)
        self.fc1 = torch.nn.Linear(64 * 16 * 16, 512)
        self.relu3 = torch.nn.ReLU()
        self.fc2 = torch.nn.Linear(512, 10)

    def forward(self, x):
        x = self.conv1(x)
        x = self.relu1(x)
        x = self.conv2(x)
        x = self.relu2(x)
        x = self.pool(x)
        x = x.view(-1, 64 * 16 * 16)
        x = self.fc1(x)
        x = self.relu3(x)
        x = self.fc2(x)
        return x

# Export the PyTorch model to ONNX
model = MyModel()
input_shape = (1, 3, 32, 32)
input_names = ['input']
output_names = ['output']
dummy_input = torch.randn(input_shape)
torch.onnx.export(model, dummy_input, 'my_model.onnx', verbose=False, input_names=input_names, output_names=output_names)

# Load the ONNX model and create a TensorRT engine from it
model_onnx = onnx.load('my_model.onnx')
engine = backend.prepare(model_onnx, device='CUDA:0')

# Create a context for executing inference on the engine
context = engine.create_execution_context()

# Allocate device memory for input and output buffers
input_name = 'input'
output_name = 'output'
input_shape = (1, 3, 32, 32)
output_shape = (1, 10)
input_buf = trt.cuda.alloc_cuda_pinned_memory(trt.volume(input_shape) * trt.float32.itemsize)
output_buf = trt.cuda.alloc_cuda_pinned_memory(trt.volume(output_shape) * trt.float32.itemsize)

# Load the PyTorch model into memory and measure inference speed
model.load_state_dict(torch.load('my_model.pth'))
model.eval()
num_iterations = 1000
total_time = 0.0
with torch.no_grad():
    for i in range(num_iterations):
        start_time = time.time()
        input_data = torch.randn(input_shape)
        output_data = model(input_data)
        end_time = time.time()
        total_time += end_time - start_time
pytorch_fps = num_iterations / total_time
print(f"PyTorch FPS: {pytorch_fps:.2f}")

# Create a TensorRT engine from the ONNX model and measure inference speed
trt_engine = backend.prepare(model_onnx, device='CUDA:0')
num_iterations = 1000
total_time = 0.0
with torch.no_grad():
    for i in range(num_iterations):
        input_data = torch.randn(input_shape).cuda()
        start_time = time.time()
        output_data = trt_engine.run(input_data.cpu().numpy())[0]
        end_time = time.time()
        total_time += end_time - start_time
tensorrt_fps = num_iterations /total_time
tensorrt_fps = num_iterations / total_time
print(f"TensorRT FPS: {tensorrt_fps:.2f}")
print(f"Speedup: {tensorrt_fps/pytorch_fps:.2f}x")
```

Output:

```bash
(model-train-py3.10) jetson-dublin@ubuntu:~/Development/shekhar/model_train$ python benchmark.py 
PyTorch  Inference Time: 0.007773 seconds
TensorRT Inference Time: 0.002509 seconds
TensorRT is 3.10x faster than PyTorch
```
