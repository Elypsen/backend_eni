FROM node:16.20-buster as app_node

RUN apt-get update
RUN apt-get install -y xvfb libgtk-3-0 libgbm-dev libnss3 libasound2
RUN npm i nodemon -g

WORKDIR /srv/app

# copy sources
COPY --link . .

RUN rm -rf node_modules
RUN npm i

CMD ["npm", "start"]

FROM app_node as app_node_prod

ARG VERSION
ENV NODE_ENV=production

RUN echo "SECRET=verysecret" > .env \
    && echo "MONGO_URI=mongodb://db-service/express_brains" >> .env \
    && echo "SWAGGER_HOST=express-brains.chocteau.dev" >> .env \
    && echo "SWAGGER_SCHEME=https" >> .env \
    && echo "VERSION=${VERSION}" >> .env \
    && echo "NODE_ENV=production" >> .env \
