import {
    checkAutoplayRequirements,
    checkHistoryExists,
    checkQueueEmpty,
    checkQueueExists,
    checkQueueNotPlaying,
    checkTrackExists,
} from "./validators/queueValidator";
import { checkVoiceChannel } from "./validators/voiceValidator";

export const HinagiMiddlewares = {
    checkVoiceChannel,
    checkQueueExists,
    checkHistoryExists,
    checkQueueEmpty,
    checkQueueNotPlaying,
    checkTrackExists,
    checkAutoplayRequirements,
};
