FROM oven/bun AS builder

ARG PORT
ARG SQLITE_FILE
ARG KEYDB_HOST
ARG KEYDB_PORT
ARG KEYDB_USERNAME
ARG KEYDB_PASSWORD

WORKDIR /repo

COPY package.json package.json
COPY bun.lockb bun.lockb

COPY /app/server/package.json ./app/server/package.json

COPY /app/client ./app/client
COPY /app/server ./app/server

ENV NODE_ENV=production

RUN bun install

ENV PORT=${PORT}
ENV SQLITE_FILE=${SQLITE_FILE}
ENV KEYDB_HOST=${KEYDB_HOST}
ENV KEYDB_PORT=${KEYDB_PORT}
ENV KEYDB_USERNAME=${KEYDB_USERNAME}
ENV KEYDB_PASSWORD=${KEYDB_PASSWORD}

WORKDIR /repo/app/server

RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --target bun \
    --outfile server \
    ./src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=builder /repo/app/server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE ${PORT}