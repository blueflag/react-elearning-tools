//@flow
import React from 'react';
import type {Element} from 'react';

import {Box, Text} from 'obtuse';
import ExerciseStepRecord from '../data/ExerciseStepRecord';

type Props = {
    actions: Object,
    components: Object,
    value: Object,
    scorm: Object
};

export default class ExerciseNavigation extends React.Component<Props> {
    render(): Element<*> {
        const {value, actions, scorm} = this.props;
        const {Tick} = this.props.components;


        return <Box spruceName="ExerciseNavigation">
            {value.steps
                .map((step: ExerciseStepRecord, index: number): Element<*> => {
                    const complete = step.progress === 100;
                    const previousComplete = value.steps.getIn([index - 1, 'progress']) === 100 || index < value.step;
                    const completeCheck = (complete || previousComplete);

                    const modifier = String()
                        .concat(complete && !scorm.navigationToggle ? 'complete' : '')
                        .concat(value.step === index ? ' active' : '')
                        .concat(previousComplete && !scorm.navigationToggle ? ' current' : '');

                    return <Box
                        key={index}
                        modifier={modifier}
                        onClick={completeCheck && !scorm.navigationToggle ? () => actions.onGoto(index) : null}
                        spruceName="ExerciseNavigation_step"
                    >
                        {step.name}
                        {complete && <Text> <Tick /></Text>}
                    </Box>;
                })
                .toJS()}
        </Box>;
    }
}
