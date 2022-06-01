//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mangoose = require("mongoose");
const { default: mongoose } = require("mongoose");
const { redirect } = require("express/lib/response");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mangoose.connect("mongodb+srv://todo_list:adul123rahman@cluster0.9bg5xyj.mongodb.net/todolistDB",{useNewUrlParser: true});

const itemschema ={
  name : String
}

const Item = mongoose.model("item",itemschema);

const first = new Item({
  name : "to do list"
});

const second = new Item({
  name : "click the checkbox to REMOVE"
});

const third = new Item({
  name : "click '+' to ADD"
});
const defultitems = [first,second,third];


app.get("/", function(req, res) {
  Item.find(function(err,results){
    if(results.length===0){
      Item.insertMany(defultitems,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("success");
        }
      });
      res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems: results});
    }
  });

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    const newItem = new Item({
      name : item
    }); 
    newItem.save();
    res.redirect("/work");
  } else {
    const newItem = new Item({
      name : item
    }); 
    newItem.save();
    res.redirect("/");
  }
});

app.post("/delete",function(req,res){
  Item.deleteOne({_id:req.body.checkbox},function(err){
    if(err){
      console.log(err)
    }else{
      console.log("deletion completed")
    }
  })
  res.redirect("/");
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
