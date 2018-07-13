const {promisify} = require('util');
const redis = require('redis');
const {MongoClient} = require('mongodb');
const Kojo = require('kojo');
const Stair = require('stair');
const Tasu = require('tasu');
const configLoader = require('yt-config');
const {player, region, resource} = require('@venture-api/fixtures/dictionary');


module.exports = async (initialItems=[]) => {

    const config = await configLoader('config.ini');

    // kojo
    const kojo = new Kojo(config.kojo);

    //config
    kojo.set('config', config);

    // mongo
    const mongo = await MongoClient.connect(config.mongodb.url, {useNewUrlParser: true});
    mongo.db(player).collection('index').createIndex({"email": 1}, {unique: true});
    mongo.db(region).collection('index').createIndex({"name": 1}, {unique: true});
    mongo.db(resource).collection('index').createIndex({"id": 1}, {unique: true});
    kojo.set('mongo', mongo);

    // redis
    const client = redis.createClient();
    const redisSet = promisify(client.set).bind(client);
    kojo.set('redisSet', redisSet);

    // tasu
    const tasu = new Tasu(config.tasu);
    await tasu.connected();
    kojo.set('tasu', tasu);

    // stair
    const stair = new Stair(config.stair);
    await stair.connected();
    kojo.set('stair', stair);

    await kojo.ready();

    // load initial items
    await kojo.modules.initial.feed(initialItems);

    return kojo;
};
