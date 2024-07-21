const express = require('express');

const routerUsers= express.Router();
const database = require("../database")

const activeApiKeys = require("../activeApiKeys")
const jwt = require("jsonwebtoken");

routerUsers.post("/", async (req,res)=>{
    let email=req.body.email
    let password= req.body.password
    let name= req.body.name
    let errors=[]

    if ( email == undefined){
        errors.push("email is not found in the body")
    }

    if ( password == undefined){
        errors.push("password is not found in the body")
    }else if ( password.length <= 5){
        errors.push("password should be at least 6 characters long")
    }

    if ( name == undefined){
        errors.push("name is not found in the body")
    }

    if ( errors.length > 0){
        return res.status(400).json({error:errors})
    }

    //Connect to the SQL database 

    let useradded= null;
    try{
        await database.connect()

        let usersEmail = await database.query("SELECT email FROM users WHERE email = ?", [email])

        if (usersEmail.length > 0){
            database.disConnect()
            return res.status(400).json({error: "Already a user with that email"})
        }
        useradded = await database.query('INSERT INTO users (email,name,password) VALUES (?,?,?)',
        [email,name,password]);

        await database.disConnect();
        res.json({ inserted: useradded });

    } catch (error) {
        await database.disConnect();
        res.status(500).json({ error: "Internal Server Error" });
    }
}
)

routerUsers.post("/login", async (req,res)=>{
    let email=req.body.email
    let password= req.body.password
    let errors=[]

    if ( email == undefined){
        errors.push("email is not found in the body")
    }

    if ( password == undefined){
        errors.push("password is not found in the body")
    }

    if ( errors.length > 0){
        return res.status(400).json({error:errors})
    }

    //Connect to the SQL database 
    let userselected= null;
    database.connect()

    try{
        userselected = await database.query("SELECT email,name,id FROM users WHERE email = ? AND password = ?",
        [email,password])

    } catch (err) {
        await database.disConnect();
        res.status(400).json({ error: err });
    }

    if (userselected.length == 0){
        return res.status(401).json({error: "invalid email or user; not found un database"})
    }

    database.disConnect();

    //Create ApiKey for session logged

    let ApiKey= jwt.sign(
        {
            email: userselected[0].email,
            id: userselected[0].id,
            name: userselected[0].name
        },"secretcode");
    
    activeApiKeys.push(ApiKey)
    return res.json({logged: userselected })
}
)


module.exports=routerUsers