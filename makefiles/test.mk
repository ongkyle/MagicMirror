##@ Test

# https://www.gnu.org/software/make/manual/html_node/Force-Targets.html
# Make rules that cannot be marked phony can use this as a dependency to force them to alway run, as needed.
.PHONY: .FORCE
.FORCE:

.PHONY: test-e2e
test-e2e: ## Run jest tests in tests/e2e
	./scripts/run-e2e.sh
