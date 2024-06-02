import { Lavalink } from '../../structures/Lavalink';

export default new Lavalink({
    name: 'disconnect',
    type: 'node',
    run: (client, node) => client.logger.error(`The node: ${node.options.id} is disconnected.`)
});