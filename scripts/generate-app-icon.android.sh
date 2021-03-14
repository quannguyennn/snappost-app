#!/usr/bin/env bash
set -eo pipefail

if [ $# -lt 1 ]; then
	echo "usage: $0 <input> [<size@1x>] [<output>]"
fi

if [ ! -f $1 ] ; then
	echo "file doesn't exist"
	exit 1
fi

## include common processing

source $(dirname $0)/generate-assets.include.sh

## generate assets

target_dir="${PWD}/android/app/src/main/res/mipmap"

mkdir -p ${target_dir}-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}

function image_path () {
  echo "${target_dir}-${resolution}/ic_launcher.png";
}

width=48
height=48

scale=1 resolution=mdpi generate_image

scale=1.5 resolution=hdpi generate_image

scale=2 resolution=xhdpi generate_image

scale=3 resolution=xxhdpi generate_image

scale=4 resolution=xxxhdpi generate_image
