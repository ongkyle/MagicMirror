#!/bin/sh

: ${NODE_VERSION:="18.14.2"}
: ${DEBIAN_VERSION:="bullseye"}
: ${IMG_TAG:="registry.gitlab.com/ongkyle/magicmirror:debian-buster-dev"}
: ${NODE_ENV:=""}

main() {
  docker build . \
        --rm \
        -f docker/Dockerfile-artifacts \
        --build-arg NODE_VERSION=${NODE_VERSION} \
        --build-arg DEBIAN_VERSION=${DEBIAN_VERSION} \
        --build-arg NODE_ENV=${NODE_ENV} \
        -t ${IMG_TAG};
}

main "$@"
