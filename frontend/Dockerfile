# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:14 as build

# Set the working directory
WORKDIR /usr/local/app/frontend

# Add the source code to app
COPY ./ /usr/local/app/frontend

# Install all the dependencies
RUN npm install

# Generate the build of the application
RUN npm run build

# Stage 2: Serve app with nginx server

# Use official nginx image as the base image

FROM nginx:alpine

COPY --from=build /usr/local/app/frontend/dist/Skill-Path /usr/share/nginx/html
COPY ./.nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080 80

CMD ["nginx", "-g", "daemon off;"]
