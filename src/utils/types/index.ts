import type { CommandContext, ComponentContext, MenuCommandContext, MessageCommandInteraction, ModalContext, ParseClient, ParseMiddlewares, UserCommandInteraction } from 'seyfert';
import type { HinagiClient } from '../../structures/Client';
import type { HinagiMiddlewares } from '../../middlewares';

export { AllLavaEvents, LavaEventRun, LavaEventType, LavaManagerEvents, LavaNodeEvents, LavalinkEvent } from './client/Lavalink';

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
    interface RegisteredMiddlewares extends ParseMiddlewares<typeof HinagiMiddlewares> {}
}
