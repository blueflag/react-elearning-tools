
export default function ElearningReducer(state, {type, payload}) {
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

        case 'EXERCISE/INTERACTION/SCORE':
            return state
                .setIn(currentStep.concat('score'), payload)
            ;

        case 'EXERCISE/NAVIGATION/NEXT_STEP':
            return state
                .update('step', step => Math.min(state.steps.size - 1, step + 1))
            ;

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

        default:
            return state;
    }
}
