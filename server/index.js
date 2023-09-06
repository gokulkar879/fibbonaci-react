const keys = require('./keys.js');

//express setup
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

//postgress client setup
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUSER,
    host: keys.pgHOST,
    database: keys.pgDATABASE,
    password: keys.pgPASSWORD,
    port: keys.pgPORT,
})

pgClient.on("connect", (client) => {
    client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch(err => {
            console.log(err)
        })
});

//redis client setup
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHOST,
    port: keys.redisPORT,
    retry_strategy: () => 2000
})

const redisPublisher = redisClient.duplicate();


//express route handler
app.get("/", (req, res) => {
    res.send("hi");
})

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values');

    res.send(values.rows);
})

app.get("/values/current", async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    })
})

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if(index >= 40) {
        return res.status(422).send("Too high value");
    } 
    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({working: true});
})

app.listen(5000, err => {
    console.log('listening on port 5000');
})