const express = require('express')
const authServiceClient = require('./services/authServiceClient')

const app = express()
const port = 4000

app.use('/api/getToken', (req, res) => {
    authServiceClient
        .getToken()
        .then(_ => {
            console.log(_)
            res.json(_.data)
        })
        .catch((err) => {
            console.log(err)
           
        })
})

app.listen(port, () => console.log(`Sample expressjs is listening at port ${port}`))