const http = require("http")
const app =require("./app")
const port= process.env.PORT || 3000
const connectDB= require("./config/db.config")
const server = http.createServer(app)
connectDB()
server.listen(port,()=>console.log(`the server is running on http://localhost:${port}`))