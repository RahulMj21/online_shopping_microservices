FROM node:20-alpine

WORKDIR /usr/app/product

COPY package* ./

COPY pnpm-lock.yaml ./

RUN npm i -g pnpm

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 8002

CMD ["pnpm","start"]
