//@flow
import {createActions} from 'redux-actions';
import * as scorm from '../../scorm';

export default createActions({
    EXERCISE: {
        META: {
            ADD_STEPS: undefined,
            SET_RESET: undefined
        },
        STEP: {
            SET_STATE: undefined,
            SET_QUIZ: undefined
        },
        INTERACTION: {
            SCORE: undefined,
            ANSWER: (payload: Object) => {
                payload.answers.map((item: Object) => {
                    var count = scorm.interaction();
                    var result = item.correct ? "correct" : "wrong";

                    var batch = {
                        num: count,
                        title: item.title,
                        answer: item.answer,
                        result: result,
                        correctAnswer: item.correctAnswer,
                        time: payload.time
                    };

                    scorm.setInteractionID(batch);
                    scorm.setInteractionStudentResponse(batch);
                    scorm.setInteractionResult(batch);
                    scorm.setInteractionCorrectResponse(batch);
                    scorm.setInteractionLatency(batch);
                });
            },
            FINISH: (payload: Object): Object => {
                const {result,score} = payload;
                const status = result ? scorm.complete(score) : scorm.fail(score);
                var batch = {
                    status: status,
                    score: score
                };
                return batch;
            }

        },
        NAVIGATION: {
            END_STEP: undefined,
            NEXT_STEP: undefined,
            PREVIOUS_STEP: undefined,
            GOTO_STEP: undefined,
            PROGRESS_STEP: undefined
        }
    }
});
