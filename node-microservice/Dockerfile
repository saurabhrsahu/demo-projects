FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY src ./src

ENV PORT=3000
ENV SERVICE_NAME=node-microservice

EXPOSE 3000

CMD ["npm", "start"]

