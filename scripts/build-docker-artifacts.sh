#!/bin/sh

: ${NODE_VERSION:="18"}
: ${PYTHON_VERSION:="3.10"}
: ${IMG_TAG:="registry.gitlab.com/ongkyle/magicmirror:buildkit-artifacts-dev"}

main() {
  docker build . \
        --rm \
        -f docker/Dockerfile-artifacts \
        --build-arg NODE_VERSION=${NODE_VERSION} \
        --build-arg PYTHON_VERSION=${PYTHON_VERSION} \
        -t ${IMG_TAG};
}

main "$@"
