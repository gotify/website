---
id: rescale-images
title: Rescale and optimize uploaded images
---

Users can upload an image for an application. However,  large images are not
rescaled by Gotify and can take up unneeded disk space and network bandwidth.
It can also be a server hazard when a huge n image is uploaded taking up the
remaining disk space. Installing the script below will rescale (resize) all
images in their maximum dimension, i.e. width and/or height, to 512 pixels.
Images that are smaller will not be rescaled.

PNG images will also be optimized in file size without reduction of quality.
Once a file has been rescaled, it will not be rescaled again later.

# Prerequisites

Install the following packages:

```bash
sudo apt-get install imagemagick optipng
```

# Script

Create a script, e.g. `/opt/gotify-rescale-images.sh` containing

```shell
#!/usr/bin/env sh
set -e

DATA=/opt/gotify/data
cd $DATA/images
for FILE in *; do
    if [ $FILE -nt $DATA/images-rescaled ]; then
        EXT=$(echo "${FILE#*.}"|tr '[:upper:]' '[:lower:]')
        if [ $EXT = png -o $EXT = jpg -o $EXT = jpeg  -o $EXT = gif ]; then
            convert $FILE -resize "512>" $FILE
        fi
        if [ $EXT = png ]; then
            optipng $FILE
        fi
    fi
done
touch $DATA/images-rescaled
```

Note that if `$DATA/images-rescaled` is missing, all files are selected for
rescaling and optimization. 

Run the following command on the script

```bash
sudo chmod go-rw /opt/gotify-rescale-images.sh
sudo chmod u+x /opt/gotify-rescale-images.sh
```

The script can be tested by running it manually. Having a backup of the data
directory before doing that is always wise.

If users upload images with a transparent background that make the image hard to
see, it is possible to enforce a white background by adding the following line
before the `optipng` command for PNG images

```shell
            convert $FILE -background white -alpha remove -alpha off $FILE
```

and add it in an extra `if` for GIF images.

# Scheduling

Add the following line to a file in e.g. `/etc/cron.d/gotify`

```shell
12	12	* * *	root	/opt/gotify/gotify-optimize-images.sh
```
