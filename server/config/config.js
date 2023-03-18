require('dotenv').config()
const dev = {
    db: {
        url: process.env.DBURL || "mongodb://127.0.0.1:27017/DBMS"
    },
    app: {
        port: process.env.port || 8080
    }
}

module.exports = dev