# syntax=docker/dockerfile:1.7-labs

# Build the server and client
FROM oven/bun:latest AS builder

WORKDIR /repo

COPY package.json package.json
COPY bun.lockb bun.lockb
COPY tsconfig.json tsconfig.json

COPY /app/server/package.json ./app/server/package.json

COPY /app/client ./app/client
COPY /app/server ./app/server

ENV NODE_ENV=production

RUN bun install

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