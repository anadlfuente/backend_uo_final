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
const routerPresents= require("./routers/routerPresents")

app.use(cors())
app.options('*', cors());
app.use(express.json())

//Middleware
app.use(["/presents"] ,(req,res,next)=>{

	let apiKey = req.query.apiKey
	if ( apiKey == undefined ){
		res.status(401).json({ error: "no apiKey" });
		return 
	}
	let infoInApiKey = jwt.verify(apiKey, "secretcode");
	if ( infoInApiKey == undefined || activeApiKeys.indexOf(apiKey) == -1){
		res.status(401).json({ error: "invalid apiKey" });
		return 	
	}

	// desencrypted in req
	req.infoInApiKey = infoInApiKey;
  next()
})

app.use("/users", routerUsers)
app.use("/presents", routerPresents)

app.listen (port, () =>{
    console.log("Servidor activo en "+port)
})