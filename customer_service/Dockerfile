FROM node:20-alpine

WORKDIR /usr/app/customer

COPY package* ./

RUN npm install

COPY . .

EXPOSE 8001

CMD ["npm","run","start"]
