#!/bin/sh

: ${BUILDER_IMG:="registry.gitlab.com/ongkyle/magicmirror:buildkit-artifacts-dev"}
: ${IMG_TAG:="registry.gitlab.com/ongkyle/magicmirror:debian-buster-dev"}
: ${GIT_INFO:="placeholder"}


main() {
  docker build . \
          --rm \
          -f docker/Dockerfile-debian \
          --build-arg BUILDER_IMG=${BUILDER_IMG} \
          --build-arg GIT_INFO=${GIT_INFO} \
          -t ${IMG_TAG}
}

main "$@"
