FROM alpine:3.12

RUN apk add --update nodejs npm

WORKDIR /simple-icons
COPY package*.json /simple-icons/
RUN npm install

COPY . .

ENTRYPOINT ["npm", "run", "svgo", "--", "/image.svg"]
