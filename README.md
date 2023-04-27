## Dev locally

```
npm i
env-cmd npx functions-framework --target=tiktok
```

## Deploy

```
gcloud functions deploy tiktok \
--allow-unauthenticated \
--runtime=nodejs18 \
--update-env-vars CLOUDINARY_URL=PASTE_KEY_HERE,TIK_API_KEY=PASTE_KEY_HERE \
--trigger-http
```
