---
id: optimize-images
title: Optimize uploaded images
---

Users can upload images for applications. Large images are not rescaled by
Gotify and can take up unneeded disk space and network bandwidth. The script
below will rescale (resize) all images in their maximum dimension, i.e. width
and/or height, to 512 pixels. Images that are smaller will not be rescaled.

PNG images will be optimized in file size without reduction of quality.

Once a file has been rescaled/optimized, it will not be rescaled/optimized
again later.

## Prerequisites

Install

- [ImageMagick](https://imagemagick.org/)
- [optipng](https://optipng.sourceforge.net/)

## Script

Create a script, e.g. `/opt/gotify/optimize-images.sh` containing

```bash
#!/usr/bin/env bash
set -e

DATA=/home/jm/src/gotify/server/data

for FILE in "$DATA"/images/*; do
    if [ "$FILE" -nt "$DATA"/images-optimized ]; then
        EXT=$(echo "${FILE##*.}"|tr '[:upper:]' '[:lower:]')
        if [ "$EXT" = png -o "$EXT" = jpg -o "$EXT" = jpeg  -o "$EXT" = gif ]; then
            convert "$FILE" -resize "512>" "$FILE"
        fi
        if [ "$EXT" = png ]; then
            optipng "$FILE"
        fi
    fi
done
touch "$DATA"/images-optimized
```

Note that if `$DATA/images-optimized` is missing, all files are selected for
rescaling and optimization.

Run the following command on the script

```bash
sudo chmod go-rw /opt/gotify/optimize-images.sh
sudo chmod u+x /opt/gotify/optimize-images.sh
```

The script can be tested by running it manually. Having a backup of the data
directory before doing that is always wise.

## Scheduling

Add the following line to a file in e.g. `/etc/cron.d/gotify`

```cron
12	12	* * *	root	/opt/gotify/optimize-images.sh
```
