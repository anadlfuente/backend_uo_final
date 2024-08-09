const express = require('express');

const routerPresents= express.Router();
const database = require("../database")

routerPresents.post("/", async (req,res) => {
    //Define all values
    let name= req.body.name
    let description = req.body.description
    let website = req.body.website
    let price = parseFloat(req.body.price)

    let errors=[]

    if ( name == undefined){
        errors.push("name is not found in the body")
    }

    if ( description == undefined){
        errors.push("description is not found in the body")
    }

    if ( website == undefined){
        errors.push("URL of the present not found in the body")
    }

    if ( price == undefined){
        errors.push("price is not found in the body")
    }else if (isNaN(price) == true){
        errors.push("Price not a valid format")
    }

    if ( errors.length > 0){
        return res.status(400).json({error:errors})
    }

    //Add Present to database

    let insertPresent= null;
    try{
        await database.connect()

        let insertPresent = await database.query("INSERT INTO presents (idUser,present,description,url,price,emailUser,ChosenBy) VALUES (?,?,?,?,?,?,?)",
            [req.infoInApiKey.id,name,description,website,price,req.infoInApiKey.email,null])

        await database.disConnect();
        res.json({ inserted: insertPresent });

    } catch (error) {
        await database.disConnect();
        res.status(500).json({ error: "Internal Server Error" });
    }
})

routerPresents.get("/:userEmail?",async (req,res)=>{
    let emailUser=req.infoInApiKey.email
    let emailUserquery=req.query.userEmail

    if ( emailUser == undefined){
        res.status(400).json({error:"name is not found in the body"})
    }

    if (emailUserquery != undefined){
        try{
            await database.connect()
    
            let PresentList = await database.query("SELECT presents.* FROM presents WHERE presents.emailUser = ?",
                [emailUserquery])
    
            await database.disConnect();
            res.json({ present: PresentList });
    
        } catch (error) {
            await database.disConnect();
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    try{
        await database.connect()

        let PresentList = await database.query("SELECT presents.* FROM presents WHERE presents.emailUser = ?",
            [emailUser])

        await database.disConnect();
        res.json({ present: PresentList });

    } catch (error) {
        await database.disConnect();
        res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports=routerPresents