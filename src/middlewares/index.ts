import { checkPermissions } from "./validators/permissionsValidator";
import { checkQueueExists, checkHistoryExists, checkQueueEmpty, checkQueueNotPlaying, checkTrackExists, checkAutoplayRequirements } from './validators/queueValidator';
import { checkVoiceChannel } from "./validators/voiceValidator";
import type { HinagiMiddlewaresType } from "../utils/types";

export const HinagiMiddlewares: HinagiMiddlewaresType = {
    checkVoiceChannel,
    checkPermissions,
    checkQueueExists,
    checkHistoryExists,
    checkQueueEmpty,
    checkQueueNotPlaying,
    checkTrackExists,
    checkAutoplayRequirements
};