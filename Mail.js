const bodyParser =  require("body-parser");
const express = require("express");
const request = require("request")
const app = express();
const https  = require("https");
const { subscribe } = require("diagnostics_channel");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true})); 

app.listen(3000, function(){
    console.log("listening");
});

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signUp.html");
});

app.post("/", function(req, res){
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed", 
                merge_fields: {
                    FNAME :firstName,
                    LNAME :lastName
                }
            }
        ]
    }

    
    const jsonData = JSON.stringify(data);
    const url = "https://us17.api.mailchimp.com/3.0/lists/49a987adb9";
    const options = {
        method : "POST",
        auth: "TonyYung:34b2f8d0a90852e25354da8f97da3f15-us17"
    }
    const request = https.request(url,  options, function(response){

        
       if (response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
       }
       else{
        res.sendFile(__dirname + "/failure.html");
       }
       
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })

    });

    request.write(jsonData);
    request.end()

});

app.post("/failure", function(req,res){
    res.redirect("/");
});
// 49a987adb9 list ID