FROM node:6

WORKDIR /work
COPY package*.json /work/
RUN npm install

COPY * /work/
ENTRYPOINT [ "npm", "run", "svgo", "--", "/image.svg" ]
