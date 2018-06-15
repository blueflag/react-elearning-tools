//@flow
import React from 'react';
import type {Element} from 'react';
import type {ComponentType} from 'react';
import {connect} from 'react-redux';
import {Some} from 'fronads';
import {Box} from 'obtuse';

import ExerciseActions from '../data/ExerciseActions';
import ExerciseRecord from '../data/ExerciseRecord';
import ExerciseNavigation from './ExerciseNavigation';
const {meta, navigation, interaction, step} = ExerciseActions.exercise;

type Props = {
    addSteps: Function,
    scorm: Object,
    components: Object,
    navigation: ComponentType<*>,
    onNext: Function,
    onEnd: Function,
    onScore: Function,
    onFinish: Function,
    onPrevious: Function,
    onGoto: Function,
    onAnswer: Function,
    onSetResetPrevStep: Function,
    onStepSetQuiz: Function,
    onStepSetState: Function,
    onProgress: Function,
    steps: Object[],
    value: ExerciseRecord
};

class ModuleSteps extends React.Component<Props> {
    static defaultProps = {
        navigation: ExerciseNavigation
    }
    constructor(props: Props) {
        super(props);
        const {addSteps, steps, value} = props;

        if(value.steps.size === 0) {
            addSteps(steps);
        }
    }

    componentWillReceiveProps(nextProps: Object) {
        if(nextProps.value.step !== this.props.value.step){
            window.scroll(0, 0)   
        }
    }

    renderMenuIcon(): ?Element<*> {
        return <svg viewBox="12 16 22 16" width="25" height="25" fill="white">
            <path d="M13,18.5c0,0.275,0.225,0.5,0.5,0.5h21c0.275,0,0.5-0.225,0.5-0.5v-3c0-0.275-0.225-0.5-0.5-0.5h-21
        c-0.275,0-0.5,0.225-0.5,0.5V18.5z M13,25.5c0,0.275,0.225,0.5,0.5,0.5h21c0.275,0,0.5-0.225,0.5-0.5v-3c0-0.275-0.225-0.5-0.5-0.5
        h-21c-0.275,0-0.5,0.225-0.5,0.5V25.5z M13,32.5c0,0.275,0.225,0.5,0.5,0.5h21c0.275,0,0.5-0.225,0.5-0.5v-3
        c0-0.275-0.225-0.5-0.5-0.5h-21c-0.275,0-0.5,0.225-0.5,0.5V32.5z"
            />
        </svg>;
    }

    render(): ?Element<*> {
        let {
            scorm,
            components = {},
            navigation: Navigation,
            onNext,
            onEnd,
            onScore,
            onFinish,
            onPrevious,
            onGoto,
            onAnswer,
            onSetResetPrevStep,
            onStepSetQuiz,
            onStepSetState,
            onProgress,
            value
        } = this.props;

        if(!value.steps.size) {
            return null;
        }

        // default components
        components = {
            Loader: ({children}) => children || "Loading...",
            Tick: () => "✔",
            MenuIcon: () => this.renderMenuIcon(),
            ...components
        };

        const step = value.getIn(['steps', value.step]);
        const childProps = {
            actions: {
                onNext,
                onEnd,
                onScore,
                onFinish,
                onPrevious,
                onGoto,
                onAnswer,
                onSetResetPrevStep,
                onStepSetQuiz,
                onStepSetState,
                onProgress
            },
            scorm,
            components,
            step,
            value
        };

        const renderableStep = this.props.steps[value.step];
        if(!renderableStep.render) {
            console.log('No render method found on', renderableStep);
        }

        return <Box>
            <Navigation {...childProps} />
            <Box modifier="marginTop6">
                {renderableStep.render(childProps)}
            </Box>
        </Box>;
    }
}


export default Some(ModuleSteps)
    .map(connect(
        (value) => ({value}),
        {
            addSteps: meta.addSteps,
            onNext: navigation.nextStep,
            onEnd: navigation.endStep,
            onScore: interaction.score,
            onFinish: interaction.finish,
            onPrevious: navigation.previousStep,
            onGoto: navigation.gotoStep,
            onAnswer: interaction.answer,
            onSetResetPrevStep: meta.setReset,
            onStepSetQuiz: step.setQuiz,
            onStepSetState: step.setState,
            onProgress: navigation.progressStep
        }
    ))
    .value();
