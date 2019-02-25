const express = require("express");
const bcrypt = require("bcryptjs");
const helmet = require("helmet")
const server = express();

server.use(helmet());
server.use(express.json());

server.get("/api/register", (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10)
    user.password = hash;
    
})


module.exports = server;