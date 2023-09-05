FROM node:16.20-buster as app_node

RUN apt-get update
RUN apt-get install xvfb libgtk-3-0 libgbm-dev libnss3 libasound2
RUN npm i nodemon -g

WORKDIR /srv/app

# copy sources
COPY --link . .

RUN rm -rf node_modules
RUN npm i

CMD ["npm", "start"]
