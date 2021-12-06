#region buidler
FROM node:14-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install glob rimraf
RUN npm install --only=development

COPY . .

RUN npm run build
#endregion builder

FROM keymetrics/pm2:14-alpine as prod

ARG NODE_END=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY . .
COPY --from=builder /usr/src/app/dist ./dist

CMD ["pm2-runtime", "start", "ecosystem.config.js"]