### STAGE 1: Build ###

FROM node:14-alpine as builder

WORKDIR /usr/angular-workdir

COPY . /usr/angular-workdir
RUN yarn --frozen-lockfile && \
    node node_modules/@angular/cli/bin/ng build --prod && \
    chmod -R 666 dist/dependencies-graph/assets/config.json

### STAGE 2: Setup ###

FROM nginx:1.20.0-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /usr/angular-workdir/dist/dependencies-graph/ /usr/share/nginx/html/

COPY docker/replace-env.sh /docker-entrypoint.d/

RUN chmod -R 775 /docker-entrypoint.d/replace-env.sh
