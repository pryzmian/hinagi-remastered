import { checkPermissions } from "./validators/permissionsValidator";
import { checkQueue } from './validators/queueValidator';
import { checkVoiceChannel } from "./validators/voiceValidator";

export const HinagiMiddlewares = {
    checkVoiceChannel,
    checkQueue,
    checkPermissions
};