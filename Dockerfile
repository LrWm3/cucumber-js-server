FROM node:alpine

WORKDIR /e2e-tests
COPY node_modules node_modules
COPY src src
COPY features features
ENTRYPOINT [ "node", "src" ]
