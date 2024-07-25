import type { HinagiMiddlewaresType } from "../utils/types";
import { checkPermissions } from "./validators/permissionsValidator";
import {
    checkAutoplayRequirements,
    checkHistoryExists,
    checkQueueEmpty,
    checkQueueExists,
    checkQueueNotPlaying,
    checkTrackExists,
} from "./validators/queueValidator";
import { checkVoiceChannel } from "./validators/voiceValidator";

export const HinagiMiddlewares: HinagiMiddlewaresType = {
    checkVoiceChannel,
    checkPermissions,
    checkQueueExists,
    checkHistoryExists,
    checkQueueEmpty,
    checkQueueNotPlaying,
    checkTrackExists,
    checkAutoplayRequirements,
};
