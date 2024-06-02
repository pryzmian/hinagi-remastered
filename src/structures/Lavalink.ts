import type { AllLavaEvents, LavaEventRun, LavaEventType, LavaManagerEvents, LavaNodeEvents, LavalinkEvent } from '../utils/types';

export class Lavalink<K extends keyof AllLavaEvents = keyof AllLavaEvents> implements LavalinkEvent<K> {
    readonly name: K;
    readonly run: LavaEventRun<K>;
    readonly type: LavaEventType<K>;

    constructor(event: LavalinkEvent<K>) {
        this.name = event.name;
        this.run = event.run;
        this.type = event.type;
    }

    public isNode(): this is Node {
        return this.type === 'node';
    }

    public isManager(): this is Manager {
        return this.type === 'manager';
    }
}

type Node = Lavalink<keyof LavaNodeEvents>;
type Manager = Lavalink<keyof LavaManagerEvents>;