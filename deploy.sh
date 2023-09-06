#!/bin/bash
export $(cat .env | xargs)
export $(cat .env.prod | xargs) 
docker-compose -f docker-compose-build.yaml build
echo $GITHUB_TOKEN | docker login ghcr.io -u Yoann-TYT --password-stdin
docker-compose -f docker-compose-build.yaml push
cp k3s/template-app-deployment.yaml k3s/app-deployment.yaml
sed -i "" "s/VERSION/$VERSION/g" k3s/app-deployment.yaml
kubectl --kubeconfig ~/.kube/express-brains  apply -f k3s/app-deployment.yaml
