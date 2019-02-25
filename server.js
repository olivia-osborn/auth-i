const express = require("express");
const bcrypt = require("bcryptjs");
const helmet = require("helmet")
const server = express();
const Users = require("./users/users-module");

server.use(helmet());
server.use(express.json());

server.post("/api/register", (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 2);
    user.password = hash;

    Users.insert(user)
        .then(registered => {
            res.status(201).json(registered)
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

server.post("/api/login", (req, res) => {
    let {username, password} = req.body;

    Users.getBy({username})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({message: `Welcome ${user.username}`})
            } else {
                res.status(401).json({message: "Invalid credentials!!"})
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

function restricted(req, res, next) {
    const {username, password} = req.headers;
    if (username && password) {
        Users.getBy({username})
            .first()
            .then(user => {
                if (user && bcrypt.compareSync(password, user.password)) {
                    next()
                } else {
                    res.status(401).json({message: "Invalid credentials!!"})
                }
            })
            .catch(error => {
                res.status(500).json({error: "ran into error"});
            })
    } else {
        res.status(400).json({message: "provide credentials!"})
    }
}

server.get("/api/users", restricted, (req, res) => {
    Users.get()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            res.status(500).json(error)
        })
})
module.exports = server;