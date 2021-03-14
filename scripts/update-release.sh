#!/usr/bin/env bash
set -xeo pipefail

VALUE=$(node -e 'console.log(require("./package.json").version)')

cat <<EOS > ./src/helpers/release.ts
export const RELEASE_VERSION = '${VALUE}';
EOS
