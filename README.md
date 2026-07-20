# TeleConnect

Marketing site and plan picker for **TeleConnect**, a modern cellphone provider. Built to deploy on [DigitalOcean App Platform](https://docs.digitalocean.com/products/app-platform/).

## Local development

```bash
npm install
npm start
```

Open [http://localhost:8080](http://localhost:8080).

## App Platform

The App Spec lives at [`.do/app.yaml`](.do/app.yaml). After this repo is connected to your DigitalOcean account:

1. Push to `main`
2. Create the app from the spec (Dashboard → Create App → or `doctl apps create --spec .do/app.yaml`)
3. App Platform builds with the Node.js buildpack and serves on port `8080`

Health check: `GET /api/health`  
Plans API: `GET /api/plans`
