FROM node:lts-alpine3.21

WORKDIR /app

COPY package*.json ./
RUN npm install

# Igual que backend: el código lo montamos como volumen
# COPY . . 

EXPOSE 3000

CMD ["npm", "run", "dev"]
