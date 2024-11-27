const express = require("express");
const connectDB = require("./config/database");
const { error } = require("./middlewares/error.middleware");
const userRoutes = require("./router/userrouter");
const TodoRoutes = require("./router/todo.router")
const { PORT } = require("./config");
const cookieParser = require("cookie-parser")
connectDB()
const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json())            // built in middleware
app.use(cookieParser())
app.use("/users",userRoutes)       // router level middleware
app.use("/todos",TodoRoutes)
app.use(error)                     // error level middleware

app.listen(PORT,(err)=>{
    if(err) console.log("error while starting their server",err)
    console.log("server running.....at 9000");
})


