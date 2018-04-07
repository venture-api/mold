module.exports = (kojo) => {

    const stair = kojo.get('stair');
    const tasu = kojo.get('tasu');
    const player = kojo.module('player');

    stair.read('player.register', async (payload) => {
        const newPlayer = await player.register(payload);
        await tasu.publish(`${payload.id}.player.registered`, newPlayer);
    });
};
