## Dev locally

```
npm i
env-cmd npx functions-framework --target=turbo
```

## Deploy

```
gcloud functions deploy turbo \
--allow-unauthenticated \
--runtime=nodejs18 \
--set-env-vars OPENAI_API_KEY=PASTE_KEY_HERE \
--trigger-http
```
