FROM node:16-alpine  

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY controllers ./
COPY models ./
COPY routes ./
COPY services ./
COPY app.js ./
COPY secret.env ./

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD [ "node", "app.js" ]
