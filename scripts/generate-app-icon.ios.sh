#!/usr/bin/env bash
set -eo pipefail

if [ $# -lt 1 ] ; then
	echo "usage: $0 <input> [<size@1x>] [<output>]"
  exit
fi

if [ ! -f $1 ] ; then
	echo "file doesn't exist"
	exit 1
fi

## include common processing

source $(dirname $0)/generate-assets.include.sh

width=48
height=48

## generate assets

APP_NAME_CODE=$(find $PWD/ios -name '*.xcodeproj' -maxdepth 1 -exec basename {} .xcodeproj \;)

target_dir="${PWD}/ios/${APP_NAME_CODE}/Images.xcassets/AppIcon.appiconset"

mkdir -p $target_dir

function image_path () {
  echo "${target_dir}/${prefix}-${width}x${height}@${scale}x.png";
}

# https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/app-icon/#app-icon-sizes

width=60 height=60 scale=2 prefix=iphone generate_image # App Icon for iPhone

width=60 height=60 scale=3 prefix=iphone generate_image # App Icon for iPhone

width=83.5 height=83.5 scale=2 prefix=ipad generate_image # App Icon for iPad Pro

width=76 height=76 scale=2 prefix=ipad generate_image # App Icon for iPad, iPad mini

width=1024 height=1024 scale=1 prefix=ios-marketing generate_image # App Icon for App Store

width=20 height=20 scale=2 prefix=iphone generate_image # Notification for iPhone, iPad Pro, iPad, iPad mini

width=20 height=20 scale=3 prefix=iphone generate_image # Notification for iPhone

width=29 height=29 scale=2 prefix=iphone generate_image # Settings for iPhone, iPad Pro, iPad, iPad mini

width=29 height=29 scale=3 prefix=iphone generate_image # Settings for iPhone

width=40 height=40 scale=2 prefix=iphone generate_image # Spotlight for iPhone, iPad Pro, iPad, iPad mini

width=40 height=40 scale=3 prefix=iphone generate_image # Spotlight for iPhone


cat > "${target_dir}/Contents.json" <<EOL
{
  "images": [
    {
      "size": "20x20",
      "idiom": "iphone",
      "filename": "iphone-20x20@2x.png",
      "scale": "2x"
    },
    {
      "size": "20x20",
      "idiom": "iphone",
      "filename": "iphone-20x20@3x.png",
      "scale": "3x"
    },
    {
      "size": "29x29",
      "idiom": "iphone",
      "filename": "iphone-29x29@2x.png",
      "scale": "2x"
    },
    {
      "size": "29x29",
      "idiom": "iphone",
      "filename": "iphone-29x29@3x.png",
      "scale": "3x"
    },
    {
      "size": "40x40",
      "idiom": "iphone",
      "filename": "iphone-40x40@2x.png",
      "scale": "2x"
    },
    {
      "size": "40x40",
      "idiom": "iphone",
      "filename": "iphone-40x40@3x.png",
      "scale": "3x"
    },
    {
      "size": "60x60",
      "idiom": "iphone",
      "filename": "iphone-60x60@2x.png",
      "scale": "2x"
    },
    {
      "size": "60x60",
      "idiom": "iphone",
      "filename": "iphone-60x60@3x.png",
      "scale": "3x"
    },
    {
      "idiom": "ipad",
      "size": "20x20",
      "scale": "1x"
    },
    {
      "idiom": "ipad",
      "size": "20x20",
      "scale": "2x"
    },
    {
      "idiom": "ipad",
      "size": "29x29",
      "scale": "1x"
    },
    {
      "idiom": "ipad",
      "size": "29x29",
      "scale": "2x"
    },
    {
      "idiom": "ipad",
      "size": "40x40",
      "scale": "1x"
    },
    {
      "idiom": "ipad",
      "size": "40x40",
      "scale": "2x"
    },
    {
      "idiom": "ipad",
      "size": "76x76",
      "scale": "1x"
    },
    {
      "size": "76x76",
      "idiom": "ipad",
      "filename": "ipad-76x76@2x.png",
      "scale": "2x"
    },
    {
      "size": "83.5x83.5",
      "idiom": "ipad",
      "filename": "ipad-83.5x83.5@2x.png",
      "scale": "2x"
    },
    {
      "size": "1024x1024",
      "idiom": "ios-marketing",
      "filename": "ios-marketing-1024x1024@1x.png",
      "scale": "1x"
    }
  ],
  "info": {
    "version": 1,
    "author": "xcode"
  }
}
EOL
