const express = require("express")
const {PORT} =  require("./config")
const { connectDB } = require("./config/database")
const USER_ROUTES = require("./routers/user.router")
const { error } = require("./middlewares/error.middleware")
const cookieParser = require("cookie-parser")
connectDB()
const app = express()
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())
app.use(express.json())             // built in middleware
app.use("/users",USER_ROUTES)
app.use(error)                      // error level middleware
app.listen(PORT,(err) => {
    if (err) throw err;
    console.log(`Server at Running at localhost:/${PORT}`)
})