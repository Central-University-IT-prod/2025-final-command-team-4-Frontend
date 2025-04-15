FROM dockerhub.timeweb.cloud/library/node:20-alpine AS dependencies

WORKDIR /app
COPY package.json /app/
RUN npm install

FROM dockerhub.timeweb.cloud/library/node:20-alpine AS build-env
COPY . /app/
COPY --from=dependencies /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM dockerhub.timeweb.cloud/library/nginx:1.25-alpine
COPY --from=build-env /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]