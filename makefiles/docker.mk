##@ Docker

# https://www.gnu.org/software/make/manual/html_node/Force-Targets.html
# Make rules that cannot be marked phony can use this as a dependency to force them to alway run, as needed.
.PHONY: .FORCE
.FORCE:

.PHONY: docker-build
docker-build: docker-build-llama docker-build-debian docker-prune ## Build Dockerfile-artifacts and Dockerfile-debian

.PHONY: docker-build-llama
docker-build-llama: args?=
docker-build-artifacts: ## Build Dockerfile-artifacts
	./scripts/build-docker-llama.sh $(args)

.PHONY: docker-build-debian
docker-build-debian: args?=
docker-build-debian: ## Build Dockerfile-debian
	./scripts/build-docker-debian.sh $(args)

.PHONY: docker-compose
docker-up: ## Stop and start the mm container
	cd ./docker/ && docker compose up --force-recreate -d

.PHONY: docker-down
docker-down: ## Stop the mm container
	cd ./docker/ && docker compose down

.PHONY: redeploy
redeploy: docker-build docker-up ## Rebuild and restart containers

# https://github.com/moby/moby/issues/33775
danglingImages := $(shell docker images -f dangling=true -q)
.PHONY: docker-rmi
docker-rmi: ## rmi dangling images
	@docker rmi $(danglingImages) -f || true

exitedVolumes := $(shell docker ps -aqf status=exited)
.PHONY: docker-rm-vols
docker-rm-vols: ## rm exitedVolumes 
	@docker rm -v $(exitedVolumes) || true

.PHONY: docker-prune
docker-prune: ## Prune unused images
	@docker image prune -f || true

.PHONY: docker-clean
docker-clean: docker-rmi docker-rm-vols docker-prune ## rm dangling images, exitedVolumes and unsed images

.PHONY: docker-exec
name?=mm
containerID := $(shell docker ps -f name=$(name) --format={{.ID}})
docker-exec: ## exec onto a running container w/ name
	@docker exec -it $(containerID) /bin/bash

