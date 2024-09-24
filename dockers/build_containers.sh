#!/bin/bash


echo "Building containers"



docker build  -f ./simple/Dockerfile ./simple  -t bygreg/opensearch-simple:v1
docker build  -f ./python310/Dockerfile ./python310  -t bygreg/python-data-loaders:v3
docker build  -f ./expressapi1/Dockerfile ./expressapi1  -t bygreg/nodejs-api:v1
docker build  -f ./graphqlapi/Dockerfile ./graphqlapi  -t bygreg/nodejs-graphql-api:v1

echo "Done"

# --no-cache