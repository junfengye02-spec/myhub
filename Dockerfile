FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY astro.config.mjs ./
COPY public ./public
COPY src ./src

ARG PUBLIC_SITE_URL=https://yven.0000238.xyz
ENV PUBLIC_SITE_URL=${PUBLIC_SITE_URL}

RUN npm run build

FROM nginx:1.28-alpine

COPY deploy/cicd/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --retries=5 --start-period=5s \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1

ENTRYPOINT ["nginx", "-g", "daemon off;"]
