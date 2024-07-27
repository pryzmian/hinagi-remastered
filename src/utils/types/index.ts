import type {
    CommandContext,
    ComponentContext,
    ExtraProps,
    MenuCommandContext,
    MessageCommandInteraction,
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

export type CommandProps = ExtraProps & {
    usage: string;
    examples: string[];
};

export type HinagiMiddlewaresType = typeof HinagiMiddlewares;

declare module "seyfert" {
    interface InternalOptions {
        withPrefix: true;
    }

    interface UsingClient extends ParseClient<HinagiClient> {}
    interface RegisteredMiddlewares extends ParseMiddlewares<typeof HinagiMiddlewares> {}
}
