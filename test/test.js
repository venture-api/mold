const {assert} = require('chai');
const Mold = require('../mold');
const {playerOne} = require('./fixtures');


let stair;
let tasu;
let mongo;
let mold;

describe('mold', () => {

    before(async function ()  {

        const mold = await Mold();
        stair = mold.get('stair');
        tasu = mold.get('tasu');
        mongo = mold.get('mongo')

    });

    after(function (done) {
        console.log('> stopping test mold');
        tasu.close();
        stair.close();
        mongo.close();
        done();
    });

    describe('payer subscribers', () => {

        it('handles player.register', async () => {

            const {id, email, name} = playerOne;

            tasu.subOnce(`${playerOne.id}.player.registered`, (player) => {
                assert.equal(player.email, email);
                assert.equal(player.name, name);
                assert.equal(player.id, id);
                assert.isOk(player._id);
            });
            await stair.write('player.register', {id, email, name});
            const player = await tasu.request('player.identify', {email});
            assert.equal(player.email, email);
            assert.equal(player.name, name);
            assert.equal(player.id, id);
        })


    });

});

