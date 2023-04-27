const functions = require('@google-cloud/functions-framework')
const cloudinary = require('cloudinary').v2
const TikAPI = require('tikapi')

const tikapi = TikAPI(process.env.TIK_API_KEY)

functions.http('tiktok', async (req, res) => {
  //cloud.google.com/functions/docs/samples/functions-http-cors#functions_http_cors-nodejs
  res.set('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.set('Access-Control-Max-Age', '3600')
    res.status(204).send('')
  } else {
    try {
      const { endpoint, options } = req.body
      if (endpoint === 'video') {
        const { downloadAddr, id } = options
        const response = await tikapi.public.video({ id })
        const videoData = await fetch(downloadAddr, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
            ...response.json?.$other?.videoLinkHeaders,
          },
        })
        const arrayBuffer = await videoData.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer).toString('base64')
        const video = await cloudinary.uploader.upload(`data:video/mp4;base64,${buffer}`, {
          public_id: `videos/${id}`,
          resource_type: 'video',
        })
        res.status(200).send(video)
      } else if (endpoint === 'search') {
        const response = await tikapi.public.search(options)
        res.status(200).send(response?.json)
      } else {
        // this basically combines both operations above
        const search = await tikapi.public.search(options)
        const { id, video } = search?.json.item_list[0] // only the first result
        const response = await tikapi.public.video({ id })
        const videoData = await fetch(video.downloadAddr, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
            ...response.json?.$other?.videoLinkHeaders,
          },
        })
        const arrayBuffer = await videoData.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer).toString('base64')
        const cloudVideo = await cloudinary.uploader.upload(`data:video/mp4;base64,${buffer}`, {
          public_id: `videos/${id}`,
          resource_type: 'video',
        })
        res.status(200).send(cloudVideo)
      }
    } catch (error) {
      res.status(500).send(error)
    }
  }
})
