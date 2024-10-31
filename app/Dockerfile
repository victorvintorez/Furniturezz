# syntax=docker/dockerfile:1.7-labs

# Build the server and client
FROM oven/bun:latest AS builder

# Server Args
ARG SERVER_PORT

# MySQL Args
ARG MYSQL_HOST
ARG MYSQL_PORT
ARG MYSQL_USERNAME
ARG MYSQL_PASSWORD
ARG MYSQL_DATABASE

# KeyDB Args
ARG KEYDB_HOST
ARG KEYDB_PORT
ARG KEYDB_PASSWORD

WORKDIR /repo

COPY package.json package.json
COPY bun.lockb bun.lockb
COPY tsconfig.json tsconfig.json

COPY /app/server/package.json ./app/server/package.json

COPY /app/client ./app/client
COPY /app/server ./app/server

ENV NODE_ENV=production

RUN bun install

# Server Configuration
ENV SERVER_PORT=${SERVER_PORT}

# MySQL Configuration
ENV MYSQL_HOST=${MYSQL_HOST}
ENV MYSQL_PORT=${MYSQL_PORT}
ENV MYSQL_USERNAME=${MYSQL_USERNAME}
ENV MYSQL_PASSWORD=${MYSQL_PASSWORD}
ENV MYSQL_DATABASE=${MYSQL_DATABASE}

# KeyDB Configuration
ENV KEYDB_HOST=${KEYDB_HOST}
ENV KEYDB_PORT=${KEYDB_PORT}
ENV KEYDB_PASSWORD=${KEYDB_PASSWORD}

# Move to the client repo build the client project
WORKDIR /repo/app/client

RUN bun run build

# Move to the server repo build the server project
WORKDIR /repo/app/server

RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --target bun \
    --outfile server \
    ./src/index.ts

# Copy server binary to the image to run on
FROM gcr.io/distroless/base

WORKDIR /app

# Copy Migrations folder
COPY --from=builder /repo/app/server/src/db/.migrations/ src/db/.migrations/
COPY --from=builder /repo/app/server/server server
COPY --from=builder /repo/app/client/dist/ www/

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE ${SERVER_PORT}