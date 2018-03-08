FROM node:8.2
MAINTAINER tuobc

RUN echo "Asia/Shanghai" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata

WORKDIR /admin-auth-manager

ADD ./package.json /admin-auth-manager
RUN npm install --registry=https://registry.npm.taobao.org

ADD . /admin-auth-manager

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
