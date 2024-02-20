const http = require('http')
// const express = require('express')
const app = require('./app')

const server = http.createServer(app)

const port = process.env.PORT || 3000;
server.listen(port, ()=>{
    console.log(`Server listening on port ${port}`)
})











// var con = require('./connection')

// con.connect(function(error){
//     if(error) throw error
//     con.query(" select * from wp_users", function(error, result){
//         if(error) throw error
//         console.log(result)
//     })
// })







// const mysql = require("mysql")
// const con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "techwizards"
// })

// con.connect(function(error){
//     if(error) throw error
    
//     con.query("select * from wp_users", function(error, result){
//     if(error) throw error
//     console.log(result)
//     })
// })