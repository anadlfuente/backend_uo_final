const express = require("express")
const port = 4000
const jwt = require("jsonwebtoken");
const activeApiKeys = require("./activeApiKeys")
const cors = require("cors")
const database = require("./database")

const app = express()

const routerUsers= require("./routers/routerUsers")

app.use(cors())
app.options('*', cors());
app.use(express.json())


app.use("/users", routerUsers)


app.listen (port, () =>{
    console.log("Servidor activo en "+port)
})