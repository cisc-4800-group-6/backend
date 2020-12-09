FROM node:14.15.1

ENV NODE_ENV=production

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app source code to run
COPY src/ ./src/

# Copy SQLite Database
COPY nycjobs.sqlite ./

EXPOSE 8080

CMD npm start
