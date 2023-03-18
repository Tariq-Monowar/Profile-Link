const { default: mongoose } = require("mongoose");

const config = require('./config')
const BD_Connect = async ()=>{
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(config.db.url)
        console.log(`Connected............`)
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}



module.exports = BD_Connect 