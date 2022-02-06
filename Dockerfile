############# prod_deps #############
FROM node:17.4.0-alpine as prod_deps

RUN apk add dumb-init

ENV NODE_ENV production
WORKDIR /app
COPY package.json yarn.lock ./ 
RUN yarn install --prod

############# build #############
FROM prod_deps as build

ENV NODE_ENV development
RUN yarn install
COPY ./ ./
RUN yarn build

############# final #############
FROM prod_deps

COPY --from=build /app/dist ./
COPY --from=build /app/src/swagger/output.json ./src/swagger/
CMD ["dumb-init", "node", "main.js"]