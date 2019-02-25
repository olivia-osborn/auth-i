const db = require("../data/dev.sqlite3");

function get() {
    return db(users)
}

function getById(id){
    return db(users)
        .where({id})
        .first()
}

async function insert(user) {
    const [id] = await db("users")
        .insert(user)
    
    return findById(id)
}

module.exports = {
    get,
    getById,
    insert,
}