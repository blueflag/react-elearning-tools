import {createActions} from 'redux-actions';
import * as scorm from '../../scorm';
import {Map} from 'immutable';

export default createActions({
    EXERCISE: {
        META: {
            ADD_STEPS: undefined,
        },
        STEP: {
            SET_SUBMITABLE: undefined,
        },
        INTERACTION: {
            SCORE: undefined,
            ANSWER: (payload) => {
                payload.answers.map((item, key) => {
                    var count = scorm.interaction();
                    var result = item.result ? "correct" : "wrong";
                    
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
