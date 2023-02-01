#!/bin/sh

# default runs e2e-tests for recipe_spec.js
: ${TEST_PATH_PATTERN:="tests/e2e/modules/recipe_spec.js"}
: ${PROJECT:="e2e"}
: ${NODE_ENV:="TEST"}

main() {
  NODE_ENV="${NODE_ENV}" jest --selectProjects "${PROJECT}" -i --forceExit --runTestsByPath=1 --testPathPattern="${TEST_PATH_PATTERN}"
}

main "$@"
