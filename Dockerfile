FROM node:22-alpine

RUN apk add --no-cache git

WORKDIR /simple-icons
COPY package.json /simple-icons/
COPY package-lock.json /simple-icons/
RUN npm ci --no-audit --no-fund

COPY . .

ENTRYPOINT ["npx", "svgo", "/image.svg"]
