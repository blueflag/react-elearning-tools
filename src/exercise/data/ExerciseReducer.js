//@flow
import ExerciseRecord from './ExerciseRecord';

export default function ElearningReducer(state: ExerciseRecord, {type, payload}: Object): ExerciseRecord {
    const currentStep = ['steps', state.step];

    switch (type) {
        case 'EXERCISE/META/ADD_STEPS':
            return state
                .addSteps(payload)
                // .update((state) => {
                //     const index = state.steps.findIndex(step => state.pathname === step.pathname);
                //     return state.set('step', Math.max(0, index));
                // })
            ;

        case 'EXERCISE/META/SET_RESET':
            return state
                .set('resetPreviousStep', payload);

        case 'EXERCISE/INTERACTION/SCORE':
            return state
                .setIn(currentStep.concat('score'), payload);

        case 'EXERCISE/NAVIGATION/END_STEP':
            return state
                .set('step', state.steps.size-1);

        case 'EXERCISE/NAVIGATION/NEXT_STEP':
            return state
                .update('step', step => Math.min(state.steps.size - 1, step + 1));

        case 'EXERCISE/NAVIGATION/PREVIOUS_STEP':
            return state
                .update('step', step => Math.max(0, step - 1))
            ;

        case 'EXERCISE/NAVIGATION/GOTO_STEP':
            return state
                .set('step', Math.min(state.steps.size, Math.max(0, payload)))
            ;

        case 'EXERCISE/NAVIGATION/PROGRESS_STEP':
            return state
                .setIn(currentStep.concat('progress'), Math.floor(payload))
            ;

        case 'EXERCISE/STEP/SET_STATE':
            return state
                .updateIn(currentStep.concat('state'), (existing) => ({...existing, ...payload}))
            ;

        case 'EXERCISE/STEP/SET_QUIZ':
            return state
                .setIn(currentStep.concat('quizRecord'), payload);

        case 'EXERCISE/STEP/SET_QUESTIONS':
            return state
                .setIn(currentStep.concat('questionsBatch'), payload);

        default:
            return state;
    }
}
