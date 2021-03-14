#!/usr/bin/env bash
set -eo pipefail

./scripts/generate-app-icon.android.sh assets/icon.svg
./scripts/generate-app-icon.ios.sh assets/icon.svg

./scripts/generate-native-image.sh assets/logo.svg 140x

# generate images assets for all icons (`ic_*.svg`)
for icon in $(find assets/ -name 'ic_*.svg'); do
  ./scripts/generate-native-image.sh $icon 24
done
