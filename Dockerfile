FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci
COPY . .
RUN npx nuxt prepare && npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/.output ./.output
COPY --from=build /app/package*.json ./
EXPOSE 3000
CMD ["node", "--enable-source-maps", ".output/server/index.mjs"]
