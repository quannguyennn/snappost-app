#!/usr/bin/env bash
set -xeo pipefail

source $(dirname $0)/config.sh

$(dirname $0)/update-release.sh

cd ./ios

export FORCE_BUNDLING=true

if [ -f ./Podfile ]; then
  pod install
fi

if [ -d $APP_NAME_CODE.xcworkspace ]; then
  xcodebuild build -workspace $APP_NAME_CODE.xcworkspace -scheme $APP_NAME_CODE -configuration Debug -sdk iphonesimulator -derivedDataPath ./build | xcpretty
else
  xcodebuild build -project $APP_NAME_CODE.xcodeproj -scheme $APP_NAME_CODE -configuration Debug -sdk iphonesimulator -derivedDataPath ./build | xcpretty
fi

cd ..

(cd ./ios/build/Build/Products/Debug-iphonesimulator && zip -FSr $PROJECT_DIR/build/app-debug.zip $APP_NAME_CODE.app)

echo -e '\n ==> ./build/app-debug.zip'
