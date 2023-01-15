#!/bin/sh

: ${NODE_VERSION:="16.19.0"}
: ${IMG_TAG:="registry.gitlab.com/ongkyle/magicmirror:buildkit-artifacts-dev"}

main() {
  docker build . -f docker/Dockerfile-artifacts \
        --build-arg NODE_VERSION=${NODE_VERSION} \
        -t ${IMG_TAG};
}

main "$@"
