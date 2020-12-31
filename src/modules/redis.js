const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

client.on('error', (err) => {
  console.error('Redis error: ' + err);
});

if (process.env.REDIS_PASSWORD) {
  client.send_command('AUTH', [process.env.REDIS_PASSWORD]);
}

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.setex).bind(client);
const delAsync = promisify(client.del).bind(client);
const ttlAsync = promisify(client.ttl).bind(client);

module.exports = { getAsync, setAsync, delAsync, ttlAsync };