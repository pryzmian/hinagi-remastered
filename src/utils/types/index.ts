import type { CommandContext, ComponentContext, MenuCommandContext, MessageCommandInteraction, ModalContext, ParseClient, UserCommandInteraction } from 'seyfert';
import type { HinagiClient } from '../../structures/Client';

export { AllLavaEvents, LavaEventRun, LavaEventType, LavalinkEvent } from './client/Lavalink';

export type AnyContext =
    | CommandContext
    | MenuCommandContext<MessageCommandInteraction | UserCommandInteraction>
    | ComponentContext
    | ModalContext;

declare module 'seyfert' {
    interface InternalOptions {
        withPrefix: true
    }

    interface UsingClient extends ParseClient<HinagiClient> { }
}
