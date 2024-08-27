import type {
    CommandContext,
    ComponentContext,
    ExtraProps,
    MenuCommandContext,
    MessageCommandInteraction,
    MiddlewareContext,
    ModalContext,
    ParseClient,
    ParseMiddlewares,
    UserCommandInteraction,
} from "seyfert";
import type { HinagiMiddlewares } from "../../middlewares";
import type { HinagiClient } from "../../structures/Client";

export { AllLavaEvents, LavaEventRun, LavaEventType, LavalinkEvent } from "./client/Lavalink";

export type AnyContext =
    | CommandContext
    | MenuCommandContext<MessageCommandInteraction | UserCommandInteraction>
    | ComponentContext
    | ModalContext;

declare module "seyfert" {
    interface InternalOptions {
        withPrefix: true;
    }

    interface ExtraProps {
        usage: string;
        examples: string[];
    }

    interface UsingClient extends ParseClient<HinagiClient> {}
    interface RegisteredMiddlewares extends ParseMiddlewares<typeof HinagiMiddlewares> {}
}
