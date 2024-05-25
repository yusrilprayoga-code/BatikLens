FROM node:20
WORKDIR /usr/src/app
ENV PORT=3000
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "run", "start"]
