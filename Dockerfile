# Stage 1: Build the React application using Node
FROM node:20-alpine AS build
WORKDIR /app
# Copy package files and install dependencies
COPY package*.json ./
RUN npm install
# Copy the rest of the code and build the Vite project
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
# We use the unprivileged version so it works on Rahti's secure environment
FROM nginxinc/nginx-unprivileged:alpine

# Copy your custom Nginx config over the default one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React files from Stage 1 into the Nginx folder
COPY --from=build /app/dist /usr/share/nginx/html

# Tell Rahti we are using port 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]