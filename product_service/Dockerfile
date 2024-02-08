FROM node:20-alpine

WORKDIR /usr/app/product

COPY package* ./

RUN npm install

COPY . .

EXPOSE 8002

CMD ["npm","run","start"]
