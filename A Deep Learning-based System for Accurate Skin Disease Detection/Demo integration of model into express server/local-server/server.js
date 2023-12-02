// import express from 'express';
let express = require('express');
const cors = require('cors');
let app;
app = express();

app.use(function(req, res, next) {
    console.log(`${new Date()} -${req.method} request for ${req.url}`);
    next();

});
app.use(cors({
    origin: '*'
}))
app.use(express.static("../static"));

app.listen(8100, function() {
    console.log("listening on 8100")

});