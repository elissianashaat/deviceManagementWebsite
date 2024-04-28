import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from "url";

const _dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

function randPer() {
    return Math.floor(Math.random() * 100); 
}
var locations = ['reception', 'toilet', 'bedroom1', 'bedroom2', 'kitchen', 'balacony'];
function randLoc(){
    return locations[Math.floor(Math.random() * locations.length)];
}
app.get("/", (req,res) => {
    res.render("device.ejs");
});

app.get("/add", (req,res)=>{
    res.render("add_page.ejs");
});

app.get("/logo", (req,res) => {
    res.render("device.ejs");
});

var devices = [];
app.get("/available", (req,res) => {
    res.render("availableDevices.ejs", {devices: devices});
});

app.get("/availableDevices", (req,res)=>{
    res.render("availableDevices.ejs", {devices: devices});
});

app.post("/submit", (req,res) => {
    const Ndevice = {
        name: req.body.devicename,
        type: req.body.devicetype,
        location: randLoc(),
        battery: randPer(),
    };
    devices.push(Ndevice);
    console.log("Devices: ", devices);
    res.redirect("/availableDevices");
});

app.post('/delete-article/:index', (req, res) => {
    const index = parseInt(req.params.index); // Extract index from request parameters
    if (index >= 0 && index < articles.length) {
        articles.splice(index, 1);
        res.redirect('/posts');
    } else {
        res.status(404).send('Article not found.'); // Send a not found response
    }
});

function matchDeviceName(req, res, next){
    //we want here to check if the device name we recieved is equal to a device name in the data base or not? 
    const searched = req.body["search"];
    deviceMatch = false;
    for(var i = 0; i < devices.length; i++){
        if(searched === devices[i].deviceName ){
            deviceMatch = true;
            break;
        }
        next();
    }
}

 app.post("/search", matchDeviceName, (req,res) =>{
    if(deviceMatch){ //if yes will display the device info #we may change the line below
        res.sendFile(_dirname + `/public/${device}.html`);
    }
    else{ //if no will display not found and return the same page
        console.log("Device Not Found!");
        res.sendFile(_dirname + "/public/device.html");
    }
});


app.listen(port, ()=> {
    console.log(`Listening on port ${port}`);
});