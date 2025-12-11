# Etapa 1: build
FROM node:22-alpine AS build

WORKDIR /app

# Copiar solo lo necesario para instalar deps
COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

# Copiar el resto del código y hacer el build
COPY . .
# ARG NUXT_PUBLIC_API_URL
# ENV NUXT_PUBLIC_API_URL=$NUXT_PUBLIC_API_URL
ENV NODE_ENV=development
ENV NITRO_PORT=3000
ENV HOST=0.0.0.0
ENV NUXT_DEBUG=true
ENV NUXT_DEVTOOLS=true
ENV NITRO_LOG_LEVEL=debug
RUN npm run build

# Etapa 2: runtime
FROM node:22-alpine

WORKDIR /app

# ENV NODE_ENV=development
# ENV NITRO_PORT=3000
# ENV HOST=0.0.0.0
# ENV NUXT_DEBUG=true
# ENV NUXT_DEVTOOLS=true
# ENV NITRO_LOG_LEVEL=debug

# Copiamos solo lo necesario desde la etapa de build
COPY --from=build /app/.output ./.output
COPY --from=build /app/package*.json ./

# Instalar solo deps de producción (por si las necesitas en runtime)
# RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "--enable-source-maps", ".output/server/index.mjs"]