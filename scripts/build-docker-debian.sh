#!/bin/sh

: ${NODE_VERSION:="18.13.0"}
: ${DEBIAN_VERSION:="buster"}
: ${BUILDER_IMG:="registry.gitlab.com/ongkyle/magicmirror:buildkit-artifacts-dev"}
: ${IMG_TAG:="registry.gitlab.com/ongkyle/magicmirror:debian-buster-dev"}
: ${GIT_INFO:="placeholder"}


main() {
  docker build . \
          --rm \
          -f docker/Dockerfile-debian \
          --build-arg DEBIAN_VERSION=${DEBIAN_VERSION} \
          --build-arg BUILDER_IMG=${BUILDER_IMG} \
          --build-arg GIT_INFO=${GIT_INFO} \
          --build-arg NODE_VERSION=${NODE_VERSION} \
          -t ${IMG_TAG}
}

main "$@"
