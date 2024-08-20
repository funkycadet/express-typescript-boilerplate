FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 7000

ENTRYPOINT ["/app/entrypoint.sh"]
