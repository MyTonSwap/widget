FROM node:lts-alpine

WORKDIR /app

RUN npm install -g pnpm
RUN npm install -g serve

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build-storybook

EXPOSE 6006

CMD ["npx", "serve", "-l", "6006", "storybook-static"]