FROM node:22-alpine

RUN apk add --no-cache \
  git

WORKDIR /simple-icons
COPY package.json /simple-icons/
RUN npm install --ignore-scripts --no-audit --no-fund

COPY . .

ENTRYPOINT ["npx", "svgo", "/image.svg"]
