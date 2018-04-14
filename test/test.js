const {assert} = require('chai');
const Mold = require('../mold');
const {playerOne} = require('./fixtures');


let stair;
let tasu;
let mongo;
let mold;
let config;

describe('mold', () => {

    before(async function ()  {

        const mold = await Mold();
        stair = mold.get('stair');
        tasu = mold.get('tasu');
        mongo = mold.get('mongo');
        config = mold.get('config');

    });

    after(async () => {
        console.log('> stopping test mold');
        tasu.close();
        stair.close();
        await mongo.db(config.databases.players).dropDatabase();
        await mongo.db(config.databases.acl).dropDatabase();
        await mongo.db(config.databases.factories).dropDatabase();
        mongo.close();
    });

    describe('payer subscribers', () => {

        it('handles player.register', (done) => {

            const {id, email, name} = playerOne;
            stair.write('player.register', {id, email, name});

            tasu.subOnce(`${playerOne.id}.player.registered`, (player) => {
                assert.equal(player.email, email);
                assert.equal(player.name, name);
                assert.equal(player.id, id);
                assert.isOk(player._id);
                done();
            });
        })


    });

});

