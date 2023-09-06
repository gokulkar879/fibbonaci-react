const keys = require('./keys.js');

const redis = require('redis');

//creating the redis client
const redisClient = redis.createClient({
    host: keys.redisHOST,
    port: keys.redisPORT,
    retry_strategy: () => 2000
});

//duplicating the redis client
const sub = redisClient.duplicate();

const fib = (index) => {
    if(index <= 2) return 1;

    return fib(index - 1) + fin (index - 2)
}

sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)));
})

sub.subscribe('insert');