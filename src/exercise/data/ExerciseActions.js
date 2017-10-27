import {createActions} from 'redux-actions';
import * as scorm from '../../scorm';

export default createActions({
    EXERCISE: {
        META: {
            ADD_STEPS: undefined,
        },
        INTERACTION: {
            SCORE: undefined,
            FINISH: (pass, score) => {
                const status = pass ? scorm.complete(score) : scorm.fail(score);
                return {
                    status, score
                }
            }
        },
        NAVIGATION: {
            NEXT_STEP: undefined,
            PREVIOUS_STEP: undefined,
            GOTO_STEP: undefined,
            PROGRESS_STEP: undefined
        }
    }
})
