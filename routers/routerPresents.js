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


routerPresents.get("/",async (req,res)=>{
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
             return res.json({ presents: PresentList });
    
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
        return res.json({ presents: PresentList });

    } catch (error) {
        await database.disConnect();
        res.status(500).json({ error: "Internal Server Error" });
    }
})

routerPresents.get("/:presentId",async (req,res)=>{
    let id = req.params.presentId

    if ( id == undefined){
        return res.status(400).json({error:"name id param"})
    }

    try{
        await database.connect()

        let PresentDetails = await database.query("SELECT presents.* FROM presents WHERE presents.idPres = ?",
            [id])
        await database.disConnect();

        if (PresentDetails.length === 0) {
            return res.status(404).json({ error: "No present found with this ID" });
        }

        return res.json(PresentDetails[0]);

    } catch (error) {
        await database.disConnect();
        res.status(500).json({ error: "Internal Server Error" });
    }
})

routerPresents.delete("/:id",async (req,res)=>{
    let deleteid = req.params.id

    if ( deleteid == undefined){
        return res.status(400).json({error:"name id param"})
    }

    try{
        await database.connect()

        let PresentDetails= await database.query("SELECT presents.* FROM presents WHERE presents.idPres = ?",
            [deleteid])

        if (PresentDetails[0].emailUser == req.infoInApiKey.email){
            let PresentToDelete = await database.query("DELETE FROM presents WHERE presents.idPres = ?",
                [deleteid])
            
            await database.disConnect();

            return res.json({deleted : true});
        }else {
            await database.disConnect();
            return res.status(400).json({ error: "Present is not of this user" });
        }


    } catch (error) {
        await database.disConnect();
        res.status(500).json({ error: "Internal Server Error" });
    }
})

routerPresents.put("/:id",async (req,res)=>{
    let id = req.params.id
    let name= req.body.name
    let description = req.body.description
    let website = req.body.website
    let price = parseFloat(req.body.price)

    if ( id == undefined){
        return res.status(400).json({error:"name id param"})
    }

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

    //Modify Present in database.

    try{
        await database.connect()

        let PresentDetails= await database.query("SELECT presents.* FROM presents WHERE presents.idPres = ?",
            [id])

        if (PresentDetails[0].emailUser == req.infoInApiKey.email){
            let PresentToModify = await database.query("UPDATE presents SET present= ?, description= ?, url= ?, price= ? WHERE  presents.idPres = ?",
                [name,description,website,price,id])
            
            await database.disConnect();

            return res.json({modified : PresentToModify});
        }else {
            await database.disConnect();
            return res.status(400).json({ error: "Present is not of this user" });
        }


    } catch (error) {
        await database.disConnect();
        res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports=routerPresents