#!/usr/bin/env bash

docker pull emiketic/image-processing

docker run --rm -v $PWD:$PWD -u $(id -u):$(id -g) emiketic/image-processing bash -c  "cd $PWD ; ./scripts/generate-assets.impl.sh"
