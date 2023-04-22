#!/bin/sh

: ${DEBIAN_VERSION:="buster"}
: ${PYTHON_VERSION:="3.10"}
: ${BUILDER_IMG:="registry.gitlab.com/ongkyle/magicmirror:node-python${PYTHON_VERSION}-llama-${DEBIAN_VERSION}"}
: ${IMG_TAG:="registry.gitlab.com/ongkyle/magicmirror:debian-buster-dev"}
: ${NODE_ENV:=""}

main() {
  docker build . \
        --rm \
        -f docker/Dockerfile-spike \
        --build-arg BUILDER_IMG=${BUILDER_IMG} \
        --build-arg NODE_ENV=${NODE_ENV} \
        -t ${IMG_TAG} \
        "$@";
}

main "$@"
