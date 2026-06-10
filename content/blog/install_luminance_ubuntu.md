---
title: "Installing Luminance HDR on Ubuntu"
date: 2023-09-13T11:43:23+01:00
tags:
  - luminance
  - camera
  - software
  - HDR
  - AEB
categories:
  - tools
  - photography
  - software
author: shekhar
layout: layouts/post.njk
---
### How to install luminance HDR in ubuntu 

1. install dependecies


```shell script
sudo apt install -y qtcreator qtbase5-dev qt5-qmake cmake libexiv2-dev libtiff-dev libraw-dev libpng-dev libjpeg-dev libopenexr-dev libfftw3-dev libboost-all-dev libcfitsio-dev libgsl-dev
```

This command installs the following dependencies:
- QT5 development tools
- exiv2 library
- libtiff library
- libraw library
- libpng library
- libjpeg library
- libopenexr library
- fftw3 library
- libboost library
- cfitsio library
- Gnu Gsl library


sudo apt install qttools5-dev 
sudo apt-get install qttools5-dev-tools
sudo apt install libqt5webkit5-dev 
sudo apt-get install libqt5svg5-dev
sudo apt-get install libeigen3-dev


2. install luminance hdr
    
    ```shell script
    git clone
    cd luminance-hdr
    mkdir build
    cd build
    
    cmake \                                                                                                                                                        5s 12:07:11 PM
    -DCMAKE_BUILD_TYPE="Release"  \
    -DCMAKE_INSTALL_PREFIX="$HOME/programs/lhdr" \
    ..

    make
    sudo make install
    ```