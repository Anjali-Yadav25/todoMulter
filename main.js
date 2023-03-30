const express = require('express');
const fs = require('fs');
const app = express();
const port = 4040;

//app.use(express.static("public"));
app.use(express.static("views"));

const multer = require('multer');

const storage = multer.diskStorage({
    destination : function(req, file, callback){
        if(req.path === '/'){
            callback(null, 'uploads/profile');
        }
        else{
            callback(null, 'uploads/todo');
        }
    },
    filename : function(req, file, callback){
        callback(null, file.originalname);
    }
});
app.set('view engine', 'ejs');
//app.set('views', __dirname + '/abs');
//app.use(express.static('public'));
app.use(express.static('uploads'));
const upload = multer({ storage: storage });

app.get("/", function(req, res){
    //res.render("index.ejs");
    fs.readFile("./info.txt", "utf-8", function(err, data){
        let items;
        if(data.length == 0){
            items = [];
        }
        else{
            items = JSON.parse(data);
        }
        res.render("index.ejs", {items : items});
        //res.send("done");
    });
});

app.post("/", upload.single("profile_pic"), function(req, res){
    //console.log(req.file)
    //console.log(req.body.username)
    var obj = {
        id : Date.now(),
        txt : req.body.username,
        img : "/profile/"+req.file.filename,
        state : "undone"
    }
    console.log(obj);
    writeFile(obj, function(){
        //let url = "/profile/"+req.file.filename;
        //console.log(url);
       //res.send(`<img src="${url}"/>`); 
       //res.send("file success");
       fs.readFile("./info.txt", "utf-8", function(err, data){
        let items = [];
        if(data.length != 0){
            items = JSON.parse(data);
        }
        res.render(__dirname+"/views/index.ejs", {items : items});
    });
    });
});
app.get("/index", function(req, res){
    readFile(function(data){
        data = "/profile/"+data;
        console.log(data);
        res.render("index.ejs", { url : data });
    });
});
function readFile(callback){
    fs.readFile("./info.txt", "utf-8", function(err, data){
        callback(data);
    });
}
function writeFile(obj, callback){
    fs.readFile("./info.txt", "utf-8", function(err, data){
        let items = [];
        if(data.length != 0){
            items = JSON.parse(data);
        }
        items.push(obj);
        fs.writeFile("./info.txt", JSON.stringify(items), function(err){
            callback();
        });
    });
}

app.delete("/api/deleteList/:id", (req, res) => {
    var temp = req.params.id;
    console.log(temp);
    fs.readFile("./info.txt", "utf-8", function(err, data){
        let items, index;
        items = JSON.parse(data);
        for(var i=0; i<items.length; i++){
            if(items[i].id == Number.parseInt(temp)){
                index =  i;
                break;
            }
        }
        delPic(items[index].img);
        items.splice(index, 1);
        fs.writeFile("./info.txt", JSON.stringify(items), function(err){
            console.log("write2");
            res.end();
        });
    });
    res.end();
});
function delPic(address){
    //fs.readFile("./uploads/profile", "" )
}

app.put("/api/checkList/:id", (req, res) => {
    var temp = req.params.id;
    fs.readFile("./info.txt", "utf-8", function(err, data){
        let items = [];
        items = JSON.parse(data);
        for(var i=0; i<items.length; i++){
            if(items[i].id == Number.parseInt(temp)){
                if(items[i].state == "undone"){
                    items[i].state = "done";
                }
                else{
                    items[i].state = "undone";
                }
                console.log(items[i].state);
                console.log("checked");
                break;
            }
        }
        fs.writeFile("./info.txt", JSON.stringify(items), function(err){
            res.end();
        })
        //res.json([{state : todos[i].state}]);
    });
   res.end();
});

app.listen(port, function(){
    console.log("port");
    console.log(port);
});