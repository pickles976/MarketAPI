FROM oven/bun:latest

RUN apt install -y git

COPY package.json ./

COPY . ./

RUN bun install