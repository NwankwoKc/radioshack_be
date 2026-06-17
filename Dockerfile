FROM node AS builder

WORKDIR /app
COPY ./tsconfig.json .

COPY . .


RUN npm ci

RUN npm run build

FROM node
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./package.json
RUN npm prune --production

CMD ["node", "dist/main.js"]
