import { Lavalink } from '../../structures/Lavalink';

export default new Lavalink({
    name: 'connect',
    type: 'node',
    run: (client, node) => client.logger.info(`The node: ${node.id} is now connected.`)
});