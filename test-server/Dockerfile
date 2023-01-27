FROM node:latest

WORKDIR /story-microservice

ENV PORT=5003
ENV MINIO_PORT=9000
ENV AUTH_SERVICE=http://user_microservice:5001/auth
ENV HOST=minio
ENV MONGODB_URL=mongodb://storyDB:27017/storyDB
ENV MINIO_ACCESS_KEY=minioadmin
ENV MINIO_SECRET_KEY=minioadmin

COPY ./package.json ./

RUN npm i

COPY . .

RUN npx tsc --outDir ./build/

EXPOSE 5003

CMD ["node", "."]