# TeleConnect

Marketing site and plan picker for **TeleConnect**, a modern cellphone provider. Built to deploy on [DigitalOcean App Platform](https://docs.digitalocean.com/products/app-platform/).

The on-site chatbot answers basic plan and coverage questions via [DigitalOcean Serverless Inference](https://docs.digitalocean.com/products/inference/reference/api/serverless-inference/).

## Local development

```bash
npm install
export INFERENCE_API_KEY=your_inference_api_key
# optional:
# export INFERENCE_MODEL=openai-gpt-4o-mini
npm start
```

Open [http://localhost:8080](http://localhost:8080).

## App Platform

The App Spec lives at [`.do/app.yaml`](.do/app.yaml). After this repo is connected to your DigitalOcean account:

1. Push to `master`
2. Create the app from the spec (Dashboard → Create App → or `doctl apps create --spec .do/app.yaml`)
3. Set the `INFERENCE_API_KEY` runtime secret on the `web` service (model access key for Serverless Inference)
4. App Platform builds with the Node.js buildpack and serves on port `8080`

## API

| Endpoint | Description |
| --- | --- |
| `GET /api/health` | Health check |
| `GET /api/plans` | Plan catalog |
| `POST /api/chat` | Chatbot (`{ "messages": [{ "role", "content" }] }` → `{ "reply" }`) |
