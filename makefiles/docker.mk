##@ Docker

# https://www.gnu.org/software/make/manual/html_node/Force-Targets.html
# Make rules that cannot be marked phony can use this as a dependency to force them to alway run, as needed.
.PHONY: .FORCE
.FORCE:

.PHONY: docker-build
docker-build: docker-build-artifacts docker-build-debian ## Build Dockerfile-artifacts and Dockerfile-debian

.PHONY: docker-build-artifacts
docker-build-artifacts: ## Build Dockerfile-artifacts
	./scripts/build-docker-artifacts.sh

.PHONY: docker-build-debian
docker-build-debian: ## Build Dockerfile-debian
	./scripts/build-docker-debian.sh

.PHONY: docker-compose
docker-up: docker-down ## Stop and start the mm container
	cd ./docker/ && docker compose up -d

.PHONY: docker-down
docker-down: ## Stop the mm container
	cd ./docker/ && docker compose down

