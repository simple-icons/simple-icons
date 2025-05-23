FROM node:22-alpine

RUN apk add --no-cache git

WORKDIR /simple-icons
COPY package.json /simple-icons/
COPY package-lock.json /simple-icons/
RUN npm ci --ignore-scripts --no-audit --no-fund --include=dev --include=optional

COPY . .

ENTRYPOINT ["npx", "svgo", "/image.svg"]
