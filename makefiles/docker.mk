##@ Build

# https://www.gnu.org/software/make/manual/html_node/Force-Targets.html
# Make rules that cannot be marked phony can use this as a dependency to force them to alway run, as needed.
.PHONY: .FORCE
.FORCE:

.PHONY: docker-build
docker-build: docker-build-artifacts docker-build-debian

.PHONY: docker-build-artifacts
docker-build-artifacts:
	./scripts/build-docker-artifacts.sh

.PHONY: docker-build-debian
docker-build-debian:
	./scripts/build-docker-debian.sh

.PHONY: docker-compose
docker-up: docker-down
	cd ./docker/ && docker compose up -d

.PHONY: docker-down
docker-down:
	cd ./docker/ && docker compose down

