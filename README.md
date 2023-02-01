## Dev locally

```
npm i && npx functions-framework --target=messaiges
```

## Deploy

```
gcloud functions deploy messaiges \
--allow-unauthenticated \
--runtime=nodejs18 \
--set-env-vars OPENAI_API_KEY=PASTE_KEY_HERE \
--trigger-http
```
