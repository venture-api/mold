const {assert} = require('chai');
const {spawn, exec} = require('child_process');
const Mold = require('../mold');
const {playerOne, factoryOne, initial} = require('./fixtures');


let stair;
let tasu;
let mongo;
let mold;
let config;
let stan;

describe('mold', () => {

    before(async function ()  {
        stan = spawn('export GOPATH=$HOME/go && export PATH=$PATH:$GOPATH/bin && nats-streaming-server', ['-p', '4223', '-DV'], {shell: '/bin/bash'});
        stan.stdout.on('data', (data) => {
            console.log(`stan stdout:\n${data}`);
        });
        stan.stderr.on('data', (data) => {
            console.error(`stan stderr:\n${data}`);
        });
        stan.on('error', function( err ){ throw err });
        mold = await Mold();
        stair = mold.get('stair');
        tasu = mold.get('tasu');
        mongo = mold.get('mongo');
        config = mold.get('config');

    });

    after(async () => {
        console.log('> stopping test mold');
        tasu.close();
        stair.close();
        // await Promise.all(Object.entries(config.databases).map(([k, name]) => {
        //     return mongo.db(name).dropDatabase();
        // }));
        mongo.close();
        stan.kill('SIGINT');
    });

    describe('initial module', () => {

        describe('feed', () => {

            it('feeds initial commands', async () => {
                const index = mongo.db(config.databases.regions).collection('index');
                const grasswall = await index.findOne({name: 'grasswall'});
                assert.equal(grasswall.name, 'grasswall');
                assert.equal(grasswall.defects.length, 1);
                assert.equal(grasswall.resourceTypes.length, 2);
            })
        });
    });

    describe('player subscribers', () => {

        it('handles player.register', (done) => {

            const {id, email, name} = playerOne;
            stair.write('player.register', {id, email, name});
            tasu.subOnce(`${id}.player.registered`, async () => {
                const index = mongo.db(config.databases.players).collection('index');
                const newPlayer = await index.findOne({id});
                assert.equal(newPlayer.email, email);
                done();
            });
        })
    });

    describe('factory subscribers', () => {

        it('handles factory.create', (done) => {

            const {id, name, region} = factoryOne;
            stair.write('factory.create', factoryOne);
            tasu.subOnce(`${factoryOne.ownerId}.factory.created`, async () => {
                const index = mongo.db(config.databases.factories).collection('index');
                const newFactory = await index.findOne({id});
                assert.equal(newFactory.name, name);
                assert.equal(newFactory.region, region);
                done();
            });

        })

    });

});

