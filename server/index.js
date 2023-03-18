const app = require("./app")
const config = require('./config/config')
const BD_Connect = require('./config/db')

const PORT = config.app.port

app.listen(PORT, async ()=>{
    console.log(`http://localhost:${PORT}`)
    await BD_Connect()
})