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

type State = {
    toggle: boolean
};

export default class ExerciseNavigation extends React.Component<Props, State> {
    element: ?HTMLElement;

    constructor(props: Object) {
        super(props);
        this.state = {
            toggle: false
        };
    }
    componentWillMount() {
        if (typeof window !== 'undefined') {
            window.addEventListener("click", this.closeDropdown, false);
        }
    }
    componentWillUnmount() {
        window.removeEventListener("click", this.closeDropdown, false);
    }
    closeDropdown: Function = (ee: Event) => {
        if(this.state.toggle  && this.element instanceof window.HTMLElement && !this.element.contains(ee.target)) {
            this.setState({
                toggle: false
            });
        }
    }
    onToggle = () => {
        const {toggle} = this.state;
        this.setState({
            toggle: !toggle
        });
    }

    onGoto = (index: number) => {
        this.onToggle();
        this.props.actions.onGoto(index);
    }

    render(): Element<*> {
        const {value, scorm} = this.props;
        const {Tick, MenuIcon} = this.props.components;
        const activePageName = value.steps.getIn([value.step,'name']);
        const displayClass = this.state.toggle ? "" : "displayNone";

        return <div className="ExerciseNavigationBox" ref={elem => this.element = elem}>
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
                            onClick={completeCheck && !scorm.navigationLock ? () => this.onGoto(index) : null}
                            spruceName="ExerciseNavigation_step"
                        >
                            {step.name}
                            {complete && <Text> </Text>}
                        </Box>;
                    })
                    .toJS()}
            </Box>
        </div>;
    }
}
