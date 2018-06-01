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
    constructor(props: Object) {
        super(props);
        this.state = {
            toggle: false
        };
    }
    onToggle = () => {
        const {toggle} = this.state;
        this.setState({
            toggle: !toggle
        });
    }
    render(): Element<*> {
        const {value, actions, scorm} = this.props;
        const {Tick, MenuIcon} = this.props.components;
        const activePageName = value.steps.getIn([value.step,'name']);
        const displayClass = this.state.toggle ? null : "displayNone";

        return <div className="ExerciseNavigationBox">
            <div className="ExerciseNavigationIcon" onClick={this.onToggle}>
                <Text modifier="sizeMega" className="NavIcon">
                    <MenuIcon /> 
                </Text>
                <Text modifier="sizeHecto menuText">
                    {activePageName}
                </Text>
            </div>
            <Box spruceName={`ExerciseNavigation ExerciseNavigationList ${displayClass}`}>
                {value.steps
                    .map((step: ExerciseStepRecord, index: number): Element<*> => {
                        const complete = step.progress === 100;
                        const previousComplete = value.steps.getIn([index - 1, 'progress']) === 100 || index < value.step;
                        const completeCheck = (complete || previousComplete);

                        const modifier = String()
                            .concat(complete && !scorm.navigationLock ? 'complete' : '')
                            .concat(value.step === index ? ' active' : '')
                            .concat(previousComplete && !scorm.navigationLock ? ' current' : '');

                        return <Box
                            key={index}
                            modifier={modifier}
                            onClick={completeCheck && !scorm.navigationLock ? () => actions.onGoto(index) : null}
                            spruceName="ExerciseNavigation_step"
                        >
                            {step.name}
                            {complete && <Text> <Tick /></Text>}
                        </Box>;
                    })
                    .toJS()}
            </Box>
        </div>;
    }
}
