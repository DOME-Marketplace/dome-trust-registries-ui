FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=development
ENV NITRO_PORT=3000
ENV HOST=0.0.0.0
ENV NUXT_DEBUG=true
ENV NUXT_DEVTOOLS=true
ENV NITRO_LOG_LEVEL=debug
RUN npm run build
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/.output ./.output
COPY --from=build /app/package*.json ./
EXPOSE 3000
CMD ["node", "--enable-source-maps", ".output/server/index.mjs"]