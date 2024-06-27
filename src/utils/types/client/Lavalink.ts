import type { LavalinkManagerEvents, NodeManagerEvents } from 'lavalink-client';
import type { UsingClient } from 'seyfert';
import type { Awaitable } from 'seyfert/lib/common/index.js';

export type AllLavaEvents = NodeManagerEvents & LavalinkManagerEvents;
export type LavaEventType<K extends keyof AllLavaEvents> = K extends keyof LavalinkManagerEvents ? 'manager' : 'node';
export type LavaEventRun<K extends keyof AllLavaEvents> = (client: UsingClient, ...args: Parameters<AllLavaEvents[K]>) => Awaitable<any>;

export interface LavalinkEvent<K extends keyof AllLavaEvents> {
    /** The lavalink event name. */
    name: K;
    /** The event emiter type. */
    type: LavaEventType<K>;
    /** The event run. */
    run: LavaEventRun<K>;
}