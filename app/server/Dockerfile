FROM oven/bun AS builder

ARG PORT
ARG SQLITE_PATH
ARG KEYDB_HOST
ARG KEYDB_PORT
ARG KEYDB_USERNAME
ARG KEYDB_PASSWORD

WORKDIR /app

COPY package.json package.json
COPY bun.lockb bun.lockb

RUN bun install

COPY ./src ./src

ENV NODE_ENV=production

ENV PORT=${PORT}
ENV SQLITE_PATH=${SQLITE_PATH}
ENV KEYDB_HOST=${KEYDB_HOST}
ENV KEYDB_PORT=${KEYDB_PORT}
ENV KEYDB_USERNAME=${KEYDB_USERNAME}
ENV KEYDB_PASSWORD=${KEYDB_PASSWORD}

RUN echo ${PORT}
RUN echo ${SQLITE_PATH}
RUN echo ${KEYDB_HOST}
RUN echo ${KEYDB_PORT}
RUN echo ${KEYDB_USERNAME}
RUN echo ${KEYDB_PASSWORD}

RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --target bun \
    --outfile server \
    ./src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=builder /app/server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE ${PORT}