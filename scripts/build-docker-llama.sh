#!/bin/sh

: ${PYTHON_VERSION:="3.10"}
: ${DEBIAN_VERSION:="buster"}
: ${IMG_TAG:="registry.gitlab.com/ongkyle/magicmirror:node-python${PYTHON_VERSION}-llama-${DEBIAN_VERSION}"}

main() {
  docker build . \
        --rm \
        -f docker/Dockerfile-llama \
        --build-arg PYTHON_VERSION=${PYTHON_VERSION} \
        --build-arg DEBIAN_VERSION=${DEBIAN_VERSION} \
        -t ${IMG_TAG} \
        "$@";
}

main "$@"
