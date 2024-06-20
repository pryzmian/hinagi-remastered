import { Lavalink } from '../../structures/Lavalink';

export default new Lavalink({
    name: 'reconnecting',
    type: 'node',
    run: (client, node) => client.logger.warn(`The node: ${node.options.id} is reconnecting...`)
});