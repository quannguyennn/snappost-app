# React Native

## Setup environment

- Follow [link](https://reactnative.dev/docs/environment-setup)
- Check

```bash
npx @react-native-community/cli doctor
```

## Before clone

On window: Run command

```bash

git config --global core.eol lf
git config --global core.autocrlf false

```

## Libraries and Tools

| Category           | Recommended                                                                                                  |
| ------------------ | :----------------------------------------------------------------------------------------------------------- |
| State Management   | [Apollo](https://www.apollographql.com/)                                                                     |
| UI Toolkit         | [react-native-elements](https://react-native-elements.github.io/react-native-elements)                       |
| Form               | [react-hook-form](https://react-hook-form.com/), [yup](https://github.com/jquense/yup)                       |
| Localization       | [i18next](https://react.i18next.com)                                                                         |
| Navigation         | [react-navigation](https://reactnavigation.org)                                                              |
| AsyncStorage       | [@react-native-community/async-storage](https://github.com/react-native-community/async-storage/tree/master) |
| Icons              | [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)                            |
| DateTime           | [Moment](https://momentjs.com)                                                                               |
| Type-Checking      | [Typescript](https://www.typescriptlang.org)                                                                 |
| Clean code linter  | [ESLint](https://eslint.org)                                                                                 |
| Code Formatter     | [Prettier](https://prettier.io)                                                                              |
| DevTools           | [Reactotron](https://github.com/infinitered/reactotron), [Flipper](https://fbflipper.com/)                   |
| Package Management | [Yarn](https://yarnpkg.com/lang/en)                                                                          |
| IDE                | [Visual Studio Code](https://code.visualstudio.com)                                                          |

## Command

```bash
# Develop Menu Android
adb shell input keyevent 82

# Connect to Reactotron from Android Phone
adb reverse tcp:9090 tcp:9090
```

- Codegen

```bash
yarn codegen
```

- Typegen

```bash
yarn typegen
```

Android generate a certificate

```bash
cd android && ./gradlew signingReport

# generate hash for facebook
echo SHA1-value | xxd -r -p | openssl base64
```

### Create Android keystore

```bash
keytool -genkeypair -v -keystore ./android/app/release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000

keytool -importkeystore -srckeystore ./android/app/release.keystore -destkeystore ./android/app/release.keystore -deststoretype pkcs12
```

### Build with Android

- Copy file `release.keystore` to `android/app`
- Update version name and version code in `android/app/build.gradle` if need

```gradle {highlight=5-6}
    defaultConfig {
        applicationId "com.org.app"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0"
        multiDexEnabled true
    }
```

- Go to `android` folder
- Run command

```shell
./gradlew assembleRelease
```
