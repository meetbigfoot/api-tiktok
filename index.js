const cors = require('cors')({ origin: true })
const fetch = require('node-fetch-commonjs')
const functions = require('@google-cloud/functions-framework')

functions.http('messaiges', (req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') {
      const error = new Error('Only POST requests are accepted.')
      error.code = 405
      throw error
    }

    if (!req.body.text) {
      const error = new Error('No text found in body.')
      error.code = 400
      throw error
    }

    try {
      fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          max_tokens: 200,
          model: 'text-davinci-003',
          prompt: req.body.text,
          temperature: 1,
        }),
      })
        .then((response) => response.json())
        .then((json) => res.status(200).send(json))
        .catch((error) => res.status(500).send(error))
    } catch (error) {
      res.status(500).send(error)
    }
  })
})
