# Project guidance

## Deploy Configuration (configured by /setup-deploy)
- Platform: GitHub Actions + Docker on a custom server
- Production URL: https://yven.0000238.xyz
- Deploy workflow: .github/workflows/deploy-production.yml on push to main
- Deploy status command: docker inspect yven-site-web
- Merge method: squash or normal merge into main
- Project type: Astro static web app
- Post-deploy health check: https://yven.0000238.xyz/healthz

### Custom deploy hooks
- Pre-merge: npm ci && npm run build
- Deploy trigger: automatic on push to main
- Deploy status: GitHub Actions workflow and container health
- Health check: https://yven.0000238.xyz/healthz

Production secrets live only in GitHub Actions and on the server. Never commit SSH private keys, passwords, tokens, or server environment files.
