#!/usr/bin/env bash

image_name="spt-identity/sdk-example"

get_version() {
    if [ -z "$TRAVIS_TAG" ]; then
        echo "${TRAVIS_BUILD_NUMBER}"
    else
        echo "${TRAVIS_TAG}"
    fi
}

build() {
    version=$1

    echo "Building $image_name"

    docker build -t $image_name -f docker/Dockerfile .

    docker tag $image_name containers.schibsted.io/$image_name:$version
    docker tag $image_name containers.schibsted.io/$image_name:latest
}

deploy() {
    version=$1

    echo "Pushing $image_name:$version to artifactory"
    docker push containers.schibsted.io/$image_name:$version

    echo "Pushing $image_name:latest to artifactory"
    docker push containers.schibsted.io/$image_name:latest
}

build $(get_version)

deploy $(get_version)
