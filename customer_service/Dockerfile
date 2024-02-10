FROM node:20-alpine

WORKDIR /usr/app/customer

COPY package* ./

COPY pnpm-lock.yaml ./

RUN npm i -g pnpm

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 8001

CMD ["pnpm","start"]
