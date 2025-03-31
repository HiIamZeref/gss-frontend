FROM node:22.11.0-alpine

WORKDIR /app

COPY package.json /app

RUN npm install --silent

COPY . /app

RUN npm run build

CMD ["npm", "run", "start"]