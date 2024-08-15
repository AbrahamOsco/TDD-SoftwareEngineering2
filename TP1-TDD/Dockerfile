FROM node:21

WORKDIR /usr/src/app

COPY . .

RUN npm ci 

RUN npx prisma generate

EXPOSE 3000

# npm run start:dev
CMD ["npm", "run", "start:dev"]



