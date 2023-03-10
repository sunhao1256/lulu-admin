ImageTag ?=v1.0.0
ImageName ?= sunhao1256/lulu-admin-frontend:$(ImageTag)
Platform ?=linux/amd64

VERSION=$(shell git rev-parse --short HEAD)

all: compile docker-build docker-push

compile:
	yarn build

docker-build:
	docker build --platform=$(Platform) --build-arg version=$(VERSION) -t ${ImageName} -f docker/Dockerfile .

docker-push:
	docker push ${ImageName}
