#!/bin/sh

main() {
  node_version=$(node -v)
  echo "taring package.json modules/ config/ css/ vendor/ and fonts/."
  tar -cf build_deps.tar package.json \
                          modules/ \
                          config/ \
                          css/ \
                          vendor/ \
                          fonts/;

  docker build . -f docker/Dockerfile-artifacts \
        --build-arg NODE_VERSION=16.19.0 \
        -t registry.gitlab.com/ongkyle/magicmirror:buildkit-artifacts-dev;
}

main "$@"
