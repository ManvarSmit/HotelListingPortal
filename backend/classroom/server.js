const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");

app.use(session({
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true
})
);

app.get("/register",(req,res)=>{
    let {name="anonymous"} = req.query;
    res.send(name);
});

app.listen(port, () => {
  console.log(`server is listening to port ${port}`);
});