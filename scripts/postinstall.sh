#!/bin/bash -x

# make dependencies support AndroidX

npx jetify

# keep only actually used fonts from native-base

cp ./node_modules/native-base/Fonts/Ionicons.ttf ./assets/fonts/
cp ./node_modules/native-base/Fonts/Roboto.ttf ./assets/fonts/
cp ./node_modules/native-base/Fonts/Roboto_medium.ttf ./assets/fonts/

rm ./node_modules/native-base/Fonts/*.ttf || true
