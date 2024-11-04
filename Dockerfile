FROM node:18-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY .git .git

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm run build-storybook

FROM nginx:alpine

COPY --from=builder /app/build-storybook /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
