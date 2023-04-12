const functions = require('@google-cloud/functions-framework')
const cors = require('cors')({ origin: true })
const TikAPI = require('tikapi')

const api = TikAPI(process.env.TIK_API_KEY)

functions.http('tiktok', (req, res) => {
  cors(req, res, async () => {
    try {
      let response = await api.public.search({
        category: 'videos',
        count: 1,
        query: req.body,
      })
      // response.saveVideo(
      //   response.json.itemInfo.itemStruct.video.downloadAddr,
      //   'video.mp4',
      // )
      res.status(200).send(response?.json)
    } catch (error) {
      res.status(500).send(error)
    }
  })
})
