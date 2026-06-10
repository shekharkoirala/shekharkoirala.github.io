---
title: "Installing CUDA 12.x on Ubuntu 24.04"
date: 2024-08-16T10:56:06+01:00
description: Learn how to install CUDA 12.2 on Ubuntu 24.04. Follow our
  step-by-step guide to set up NVIDIA drivers, CUDA Toolkit, and manage Python
  environments with Pyenv, Pipenv, and Poetry.
tags:
  - Nvidia
  - CUDA
  - UBUNTU
  - 24-04
  - drivers
  - pyenv
  - pipenv
  - poetry
  - cuDNN
categories:
  - Installation
  - Nvidia
author: shekhar
cover: /images/cuda-installation-ubuntu24.04.jpeg
layout: layouts/post.njk
---

# MOTIVE
So, Ubuntu 24.04 LTS was released on 25 April 2024. Its been more 3 months from the release and I thought it would be safe enough to install it in my main working computer. Wrong!!
I wanted a documentation for setting up the CUDA 12.2 in Ubuntu 24.04 but ended for reinstalling everything. Thus, here is the blog for future me to setup everything. Thanks to all the great help I found in the Internet [ referenced as links ].


## Ubuntu Drivers:
At first glance, it was nice and clean. I really the ubuntu drivers, may be it was in the ubuntu 22.x or 20.04. 

```bash
sudo ubuntu-drivers list
```
```bash
nvidia-driver-520, (kernel modules provided by nvidia-dkms-520)
nvidia-driver-470-server, (kernel modules provided by linux-modules-nvidia-470-server-generic-hwe-24.04)
nvidia-driver-555, (kernel modules provided by nvidia-dkms-555)
nvidia-driver-470, (kernel modules provided by linux-modules-nvidia-470-generic-hwe-24.04)
nvidia-driver-535-server, (kernel modules provided by linux-modules-nvidia-535-server-generic-hwe-24.04)
nvidia-driver-515, (kernel modules provided by nvidia-dkms-515)
nvidia-driver-550, (kernel modules provided by linux-modules-nvidia-550-generic-hwe-24.04)
nvidia-driver-525, (kernel modules provided by nvidia-dkms-525)
nvidia-driver-535, (kernel modules provided by linux-modules-nvidia-535-generic-hwe-24.04)
nvidia-driver-545, (kernel modules provided by nvidia-dkms-545)
nvidia-driver-560, (kernel modules provided by nvidia-dkms-560)
```
< The result might be different for the fresh out of the box Ubuntu >

and the best advertised part was :
```bash
sudo ubuntu-drivers autoinstall
# It will install the best latest version for your device.  haha
```

But, it is great to have all the nvidia-drivers installed right after the fresh OS update. cherry on top, NVIDIA-SMI works. Now, I only need to install libraries like cuda and cudnn for AI/ML pipeline. 

## Installing Nvidia CUDA
Before Installing the CUDA, check the compalibility table. 
[Nvida CUDA Compability](https://docs.nvidia.com/deploy/cuda-compatibility/)
and [Table](https://docs.nvidia.com/deploy/cuda-compatibility/#id3)

so, I chose (CUDA 12.2) as the nvidia driver 535.54.03+ was already installed on. Now to install the CUDA, Nvidia gave you three options based on the Architecture and Distribution selected:
[Nvidia CUDA installation](https://developer.nvidia.com/cuda-12-2-2-download-archive?target_os=Linux&target_arch=x86_64&Distribution=Ubuntu&target_version=22.04&target_type=deb_local)

But wait, there is no ubuntu 24.04 version. So, You can't run the network options or runfile. You have to rely on the 22.04 version deb local method. 

so I followed the following instruction method.
Note: I had added the -12-2, otherwise it was installing the latest CUDA, which was 12.6 
```bash
sudo apt-get install linux-headers-$(uname -r)
sudo apt-key del 7fa2af80
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-ubuntu2204.pin
sudo mv cuda-ubuntu2204.pin /etc/apt/preferences.d/cuda-repository-pin-600
wget https://developer.download.nvidia.com/compute/cuda/12.2.2/local_installers/cuda-repo-ubuntu2204-12-2-local_12.2.2-535.104.05-1_amd64.deb
sudo dpkg -i cuda-repo-ubuntu2204-12-2-local_12.2.2-535.104.05-1_amd64.deb
sudo cp /var/cuda-repo-ubuntu2204-12-2-local/cuda-*-keyring.gpg /usr/share/keyrings/
sudo apt-get update
sudo apt-get -y install cuda-12-2
```

Here, the problem starts, it won't install the cuda as it requires Nvidia-driver 560.x, and you have 535.x. 

### Installing latest or any Nvidia Driver version in Ubuntu [RabbitHole]
At this point, I thought lets install Nvidia-driver 560.x. I found a really well documented guide: [If Not Trye Then False's Guide for Install Nvidia Driver](https://www.if-not-true-then-false.com/2021/debian-ubuntu-linux-mint-nvidia-guide)

This thing is great, but I have question for you.
Do you know Nvidia Optimus ? what is Initramfs / prime-select / run level 3 / gdm3 / lightdm / DKMS / MODPROBE / Wayland / X org ?

if not, dont go in the rabbithole as you might end up having problem with it. 
if you want to learn about it : [Nvidia Optimus: a comfy guide](https://www.youtube.com/watch?v=Pn2iUgW3l6w)
{{< youtube Pn2iUgW3l6w >}}
Luckily the above guide have section : if you see Black Screen after Nvidia drivers install, then check following [video](https://www.youtube.com/watch?v=3vcOqqSS8xc)

### Manuall DPKG Nvidia Driver installation
Eventually, the better way to install the CUDA was to dont trust the Ubuntu for the Nvidia Drivers. Based on the great [post](https://forums.developer.nvidia.com/t/ubuntu-and-nvidia-provided-packages-conflict-breaking-installation/259150)

```bash
 sudo dpkg --force-all -P nvidia-firmware-535-535.54.03 nvidia-kernel-common-535 nvidia-compute-utils-535
 sudo apt --fix-broken install
 ```
Yes, you break the system and then fix the broken. Luckily, there was no black screen when I was doing this. 
And I am also

check Nvidia-smi, you should have Nvidia 535.x installed. 

Now you could run the above code:

```bash
sudo dpkg -i cuda-repo-ubuntu2204-12-2-local_12.2.2-535.104.05-1_amd64.deb
sudo apt update
sudo apt install cuda 
```

### solving CUDA dependencies: libtinfo5
if you have problem with libtinfo5, Based on the site: [libtinfo5](https://community.localwp.com/t/installation-failed-in-ubuntu-24-04-lts/42579)

```bash
sudo apt install software-properties-common
curl -O http://launchpadlibrarian.net/648013231/libtinfo5_6.4-2_amd64.deb
curl -O http://launchpadlibrarian.net/648013227/libncurses5_6.4-2_amd64.deb
sudo dpkg -i libtinfo5_6.4-2_amd64.deb
sudo dpkg -i libncurses5_6.4-2_amd64.deb
sudo apt install libnss3-tools
curl -O http://launchpadlibrarian.net/646633572/libaio1_0.3.113-4_amd64.deb
sudo dpkg -i libaio1_0.3.113-4_amd64.deb
sudo apt install cuda-12-2     
```

It should run and add this to ~/.profile

```bash
# set PATH for cuda 12.2 installation
if [ -d "/usr/local/cuda-12.2/bin/" ]; then
    export PATH=/usr/local/cuda-12.2/bin${PATH:+:${PATH}}
    export LD_LIBRARY_PATH=/usr/local/cuda-12.2/lib64${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}
fi
```


That should give you nvcc version
```bash
. ~/.profile
nvcc --version
```

```bash
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2023 NVIDIA Corporation
Built on Tue_Aug_15_22:02:13_PDT_2023
Cuda compilation tools, release 12.2, V12.2.140
Build cuda_12.2.r12.2/compiler.33191640_0
```

You can install cuDNN if you are into training Neural Network, check the compability version of cuDNN again: [compability matrix](https://docs.nvidia.com/deeplearning/cudnn/latest/reference/support-matrix.html)

```bash
sudo apt install cudnn9
```

And thats all you need. 

# Bonus:
## 1. Installing Pyenv in the Fresh Ubuntu 24.04

Yes, in Ubuntu right out of the box, Pyenv installation won't work.
You need to add following Prerequists:
```bash
sudo apt install -y make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
```
then

```bash
curl https://pyenv.run | bash
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc^Jecho '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc^Jecho 'eval "$(pyenv init -)"' >> ~/.zshrc
exec zsh
sudo apt install python3-pip
pyenv install 3.13
pyenv install 3.12
pyenv install 3.11
```
and so on ..

## 2. Installing Virtualenv in the Fresh Ubuntu 24.04

Pipenv
```bash
sudo apt install software-properties-common python-software-properties
sudo add-apt-repository ppa:pypa/ppa
sudo apt update
sudo apt install pipenv
```

Poetry:
```bash
curl -sSL https://install.python-poetry.org | python3 -
```




## 3. Checking Cuda with Pytorch Script. 
Here is a small script to test the GPU and the packages. 
You need to install Torch, Torchvision , Numpy to run the script. 
You can use the latest packages for this. 
```Python
import torchvision
import torch
import traceback

tcuda: torch.cuda = torch.cuda
print(f"How many gpu in the server ? -> {tcuda.device_count()}")
print(f"can torch access {tcuda.device_count()} GPUs? :> {tcuda.is_available()}")
print(f"Attempting to access GPU device name : {tcuda.current_device()} ....")


try:
    model = torchvision.models.detection.retinanet_resnet50_fpn(pretrained=True)
    model.cuda()
    model.eval()
    x = [torch.rand(3, 300, 400).cuda(), torch.rand(3, 500, 400).cuda()]
    predictions = model(x)
    print(predictions)
    print(f"is torch gpu is initialized ? :> {tcuda.is_initialized()}")
    print(f"torch cuda memory summary :> {tcuda.memory_summary()}")
    print(f"memory reserved {tcuda.memory_reserved()}")
    print(f"memory allocated {tcuda.memory_allocated()}")

except Exception as e:
    print(e)
    print("No CUDA available")
    traceback.print_exc()
```

## 4. setting up the Terminal 

### ZSH

Install Some cool [Nerd Fonts](https://www.nerdfonts.com/font-downloads)

Install zsh and oh my zsh and Terminator
```bash
sudo apt install zsh
sudo apt install terminator
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Install Oh my zsh plugins
```bash
git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
git clone https://github.com/zdharma-continuum/fast-syntax-highlighting.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/fast-syntax-highlighting
git clone --depth 1 -- https://github.com/marlonrichert/zsh-autocomplete.git $ZSH_CUSTOM/plugins/zsh-autocomplete
```

Install Powerlevel10k
```bash
 git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

Update this in the ~/.zshrc
```bash
ZSH_THEME="powerlevel10k/powerlevel10k"
plugins=(git zsh-autosuggestions zsh-syntax-highlighting fast-syntax-highlighting zsh-autocomplete python)
```

and update the zshrc and setup the theme
```bash
nano ~/.zshrc
exec zsh
p10k configure
```

### Atuin

```bash
curl --proto '=https' --tlsv1.2 -LsSf https://setup.atuin.sh | sh
atuin login
source $HOME/.atuin/bin/env
atuin login
atuin sync
```

### Handle SSH

I prefer to run multiple ssh key in a single machine and it is handled by a ssh config file.

cat config
```bash
#Default GitHub
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa

Host github-mac
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa_personal

Host gitlab
  HostName gilab.com 
  IdentityFile ~/.ssh/id_rsa_personal
```
id_rsa could be your one key and id_rsa_personal could be your personal / other github user.

```bash
cd ./ssh
sudo cp /home/shekhar/Downloads/ssh/. . 
ssh -T git@github.com
ssh-add id_rsa
ssh-add id_rsa_personal
```

