FROM node:20-alpine

WORKDIR /usr/app/shopping

COPY package* ./

RUN npm install

COPY . .

EXPOSE 8003

CMD ["npm","run","start"]
