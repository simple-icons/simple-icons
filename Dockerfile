FROM node:16-alpine

RUN apk add --no-cache \
  git

WORKDIR /simple-icons
COPY package*.json /simple-icons/
RUN npm install

COPY . .

ENTRYPOINT ["npm", "run", "svgo", "--", "/image.svg"]
