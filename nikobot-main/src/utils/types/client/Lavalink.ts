import type {
    DestroyReasonsType,
    LavalinkNode,
    Player,
    PlayerJson,
    Track,
    TrackEndEvent,
    TrackExceptionEvent,
    TrackStartEvent,
    TrackStuckEvent,
    UnresolvedTrack,
    WebSocketClosedEvent
} from 'lavalink-client';
import type { UsingClient } from 'seyfert';
import type { Awaitable } from 'seyfert/lib/common/index.js';

interface DisconnectReason {
    code?: number;
    reason?: string;
}

export interface LavaNodeEvents {
    create: [node: LavalinkNode];
    destroy: [node: LavalinkNode, destroyReason?: DestroyReasonsType];
    connect: [node: LavalinkNode];
    reconnecting: [node: LavalinkNode];
    disconnect: [node: LavalinkNode, reason: DisconnectReason];
    error: [node: LavalinkNode, error: Error, payload?: unknown];
    raw: [node: LavalinkNode, payload: unknown];
}

export interface LavaManagerEvents {
    trackStart: [player: Player, track: Track, payload: TrackStartEvent];
    trackEnd: [player: Player, track: Track, payload: TrackEndEvent];
    trackStuck: [player: Player, track: Track, payload: TrackStuckEvent];
    trackError: [player: Player, track: Track | UnresolvedTrack, payload: TrackExceptionEvent];
    queueEnd: [player: Player, track: Track, payload: TrackEndEvent | TrackStuckEvent | TrackExceptionEvent];
    playerCreate: [player: Player];
    playerMove: [player: Player, oldVoiceChannelId: string, newVoiceChannelId: string];
    playerDisconnect: [player: Player, voiceChannelId: string];
    playerSocketClosed: [player: Player, payload: WebSocketClosedEvent];
    playerDestroy: [player: Player, destroyReason?: DestroyReasonsType];
    playerUpdate: [oldPlayerJson: PlayerJson, newPlayer: Player];
}

export type AllLavaEvents = LavaNodeEvents & LavaManagerEvents;
export type LavaEventType<K extends keyof AllLavaEvents> = K extends keyof LavaManagerEvents ? 'manager' : 'node';
export type LavaEventRun<K extends keyof AllLavaEvents> = (client: UsingClient, ...args: AllLavaEvents[K]) => Awaitable<any>;

export interface LavalinkEvent<K extends keyof AllLavaEvents> {
    /** The lavalink event name. */
    name: K;
    /** The event emiter type. */
    type: LavaEventType<K>;
    /** The event run. */
    run: LavaEventRun<K>;
}