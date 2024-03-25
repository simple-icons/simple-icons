FROM node:20-alpine

RUN apk add --no-cache \
  git

WORKDIR /simple-icons
COPY package.json /simple-icons/
RUN npm install --ignore-scripts --no-audit --no-fund

COPY . .

ENTRYPOINT ["npm", "run", "svgo", "--", "/image.svg"]
