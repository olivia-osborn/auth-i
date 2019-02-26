const express = require("express");
const bcrypt = require("bcryptjs");
const helmet = require("helmet")
const server = express();
const Users = require("./users/users-module");

const sessionConfig = {
    name: "cookieName",
    secret: "random secret",
    cookie: {
        maxAge: 1000 * 60 * 60, //in ms
        secure: false,
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
}

//middleware: 
server.use(helmet());
server.use(express.json());
server.use(session(sessionConfig));

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
                req.session.user = user;
                res.status(200).json({message: `Welcome ${user.username}`})
            } else {
                res.status(401).json({message: "Invalid credentials!!"})
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

function restricted( req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({message: "you're not allowed to be here!"})
    }
}

  server.get('/api/users', restricted, (req, res) => {
    Users.get()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });
  
module.exports = server;