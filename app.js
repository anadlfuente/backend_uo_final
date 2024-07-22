//Install libraries
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const port = 4000

// Add list of ApiKeys and database
const activeApiKeys = require("./activeApiKeys")
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