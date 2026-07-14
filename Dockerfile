# Dev-only image (no production build). Fully independent from the other
# zones: its own package.json/lockfile, no shared design-system dependency.
FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3002 3333

CMD ["sh", "-c", "npx json-server --watch server.json --port 3333 --host 0.0.0.0 -w 500 & npx next dev -p 3002 -H 0.0.0.0"]
