const dotenv= require("dotenv")
dotenv.config()

const express = require("express")
const cors= require("cors")
const cookieParser=require("cookie-parser")
const app= express()
const UserRoutes =require("./routes/user.route")
const EventRoutes= require("./routes/event.route")
const rsvpRoutes =require("./routes/rsvp.route")

// middlewares
app.use(
  cors({
    origin: "https://event-platform-alpha-seven.vercel.app",
    credentials: true, 
  })
);
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))



//api
 app.use("/api/users",UserRoutes)
 app.use("/api/events",EventRoutes)
 app.use("/api/rsvp",rsvpRoutes)

module.exports= app
