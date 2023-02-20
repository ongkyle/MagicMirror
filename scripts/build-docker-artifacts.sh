#!/bin/sh

: ${NODE_VERSION:="18.13.0"}
: ${IMG_TAG:="registry.gitlab.com/ongkyle/magicmirror:buildkit-artifacts-dev"}

main() {
  docker build . \
        --rm \
        -f docker/Dockerfile-artifacts \
        --build-arg NODE_VERSION=${NODE_VERSION} \
        -t ${IMG_TAG};
}

main "$@"
