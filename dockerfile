FROM node:20.10.0
WORKDIR /usr/src/app

# Clone graphite-client from GitHub
RUN git clone -b docker https://github.com/0x63s/graphite-client.git .

# Install app dependencies + audit
RUN npm install
RUN npm fund
RUN npm audit fix

# Expose port 5173
EXPOSE 5173

# Define the command to run the app
CMD ["npm", "run", "dev", "--host"]

