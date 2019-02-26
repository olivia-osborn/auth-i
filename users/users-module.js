const knex = require("knex");
const knexConfig = require("../knexfile");
const db = knex(knexConfig.development);

function get() {
    return db("users")
}

function getBy(filter) {
    return db("users").where(filter);
}

function getById(id){
    return db("users")
        .where({id})
        .first()
}

async function insert(user) {
    const [id] = await db("users").insert(user)
    
    return getById(id)
}

module.exports = {
    get,
    getBy,
    getById,
    insert,
}