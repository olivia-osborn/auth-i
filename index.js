const express = require("express");
const server = require("./server");

port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`\n Listening on ${port} 5000 \n`)
})