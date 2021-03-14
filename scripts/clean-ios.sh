#!/usr/bin/env bash
set -xeo pipefail

cd ./ios

xcodebuild -alltargets clean

rm -fr ios/build/*

rm -fr ./Pods/*
