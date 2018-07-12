const Kojo = require('kojo');
const Stair = require('stair');
const Tasu = require('tasu');
const {MongoClient} = require('mongodb');
const configLoader = require('yt-config');
const {player, region} = require('@venture-api/fixtures/dictionary');


module.exports = async (initialItems=[]) => {

    const config = await configLoader('config.ini');

    // kojo
    const kojo = new Kojo(config.kojo);

    //config
    kojo.set('config', config);

    // mongo
    const client = await MongoClient.connect(config.mongodb.url, {useNewUrlParser: true});
    kojo.set('mongo', client);

    const playerIndex = client.db(player).collection('index');
    playerIndex.createIndex({"email": 1}, {unique: true});
    const regionIndex = client.db(region).collection('index');
    regionIndex.createIndex({"name": 1}, {unique: true});

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
