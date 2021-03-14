# Usage

## Native Image Assets

`./scripts/generate-assets.sh` generates native image assets.

Customize it according to your needs then run it.

**Requirements**

- [ImageMagick](https://www.imagemagick.org/)
  <!-- - [Inkscape](https://inkscape.org) -->

## Debug Build

### Android

Run `./scripts/build-android-debug.sh` to build debug .apk

### iOS

Run `./scripts/build-ios-debug.sh` to build debug .app

## Release Build

### Android

1.  Provide or generate a keystore

    ```sh
    keytool -genkey -v -keystore ./android/app/release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
    ```

2.  Define keystore parameters as environment variables

    - `RELEASE_KEYSTORE_FILE`: keystore file name
    - `RELEASE_KEYSTORE_PASSWORD`: keystore password
    - `RELEASE_KEYSTORE_ALIAS`: keystore alias
    - `RELEASE_KEYSTORE_ALIAS_PASSWORD`: keystore alias password

    ```sh
     export \
      RELEASE_KEYSTORE_FILE=$PWD/android/app/release.keystore \
      RELEASE_KEYSTORE_PASSWORD=releasepass \
      RELEASE_KEYSTORE_ALIAS=release \
      RELEASE_KEYSTORE_ALIAS_PASSWORD=releasepass \
    ;
    ```

3.  Run `./scripts/build-android-release.sh` to build release .apk

### iOS

1.  Provide signing credentials
2.  Run Xcode and configure signing
3.  Run `./scripts/build-ios-release.sh` to build release .app
