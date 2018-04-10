const Kojo = require('kojo');
const Stair = require('stair');
const Tasu = require('tasu');
const {MongoClient} = require('mongodb');
const configLoader = require('yt-config');
const pack = require('./package.json');


module.exports = async () => {

    const config = await configLoader('config.ini');


    // kojo

    const kojo = new Kojo('mold', config.kojo, pack);
    kojo.set('config', config);


    // mongo

    const client = await MongoClient.connect(config.mongodb.url);
    kojo.set('mongo', client);

    // drop all databases
    await Promise.all(config.databases.map((name) => {
        return client.db(name).dropDatabase();
    }));


    // tasu

    const tasu = new Tasu(config.tasu);
    await tasu.connected();
    kojo.set('tasu', tasu);


    // stair

    const stair = new Stair(config.stair);
    await stair.connected();
    kojo.set('stair', stair);

    await kojo.ready();
    return kojo;
};
