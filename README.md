# Vercel Deployment Pipeline

## This Project contains following services and folders:

- `git-deploy-app`: Next.JS App which is enables user to deploy the github react app
- `build-server`: Docker Image code which clones, builds and pushes the build to S3
- `s3-reverse-proxy`: Reverse Proxy the subdomains and domains to s3 bucket static assets

