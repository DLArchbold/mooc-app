#stage 1
FROM node:17-alpine as builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install 
COPY . .
RUN npm run build 


#Stage 2
FROM nginx:1.14.2
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./certificate.crt /etc/nginx/ssl/certs/certificate.crt
COPY ./custom.key /etc/nginx/ssl/private/custom.key
ENTRYPOINT ["nginx", "-g", "daemon off;"]

EXPOSE 443

#Final version-2023-06-30