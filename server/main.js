const fs = require('fs')
const morgan = require('morgan')
const express = require('express')

const PORT = parseInt(process.env.PORT) || 3000
const STATIC_DIR = __dirname + '/static'

const app = express()

app.use(morgan('dev'))

app.get('/search', (req, resp) => {
	const author = req.query.author

	fetch(`https://poetrydb.org/author/${author}/title`)
		.then(result => result.json())
		.then(result => {
			if (Array.isArray(result))
				return resp.status(200).json(
					result.map(v => v.title).sort()
				)
			resp.status(result.status).json({ reason: result.reason })
		})
		.catch(error => {
			resp.status(400).json(error)
		})
})

if (fs.existsSync(STATIC_DIR)) {
	console.info(`Adding static directory ${STATIC_DIR}`)
	app.use(express.static(STATIC_DIR))
}


app.listen(PORT, () => {
	console.info(`Application started on port ${PORT} at ${new Date()}`)
})
