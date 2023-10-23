FROM node:14
WORKDIR /app
COPY package.json /app
# cài đặt thư viện trong container ==> trong container có node_modules/
RUN npm install pm2 -g
RUN npm install --production
COPY . /app
EXPOSE 3002
ENV TZ Asia/Ho_Chi_Minh
CMD ["npm","start"]
