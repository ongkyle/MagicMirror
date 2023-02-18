##@ Test

# https://www.gnu.org/software/make/manual/html_node/Force-Targets.html
# Make rules that cannot be marked phony can use this as a dependency to force them to alway run, as needed.
.PHONY: .FORCE
.FORCE:

.PHONY: test-e2e
test-e2e: PROJECT?=e2e
test-e2e: TEST_PATH_PATTERN?="tests/e2e/modules/recipe_spec.js"
test-e2e: ## Run jest tests in tests/e2e
	PROJECT=$(PROJECT) TEST_PATH_PATTERN=$(TEST_PATH_PATTERN) ./scripts/run-test.sh

.PHONY: test-unit
test-unit: PROJECT?=unit
test-unit: TEST_PATH_PATTERN?="tests/unit/functions/recipe.*_spec.js"
test-unit: ## Run jest tests in tests/e2e
	 PROJECT=$(PROJECT) TEST_PATH_PATTERN=$(TEST_PATH_PATTERN) ./scripts/run-test.sh
