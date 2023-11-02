require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")

app.use(cors())
app.use(require("./routes/api"))

const port = 5005
const host = "192.168.1.125"
app.listen(port, host, () => console.log(`server berjalan di host:${host} port:${port}😎`))