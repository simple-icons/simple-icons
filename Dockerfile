FROM node:22-alpine AS base
RUN apk add --no-cache git
WORKDIR /simple-icons

FROM base AS final
WORKDIR /simple-icons
COPY . .
RUN npm ci --no-audit --no-fund

ENTRYPOINT ["npx", "svgo", "/image.svg"]
