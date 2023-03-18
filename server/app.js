const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const userRoute = require('./route/user.route')
const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/api',userRoute)

app.use((req,res,next)=>{
    res.status(404).json({
        message: "404! Route is not found"
    })
})

app.use((err,req,res,next)=>{
    res.status(500).json({
        message: "500! Sumthing Broken"
    })
})

module.exports = app