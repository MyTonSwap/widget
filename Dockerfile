FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm run build-storybook

COPY  /app/build-storybook /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
