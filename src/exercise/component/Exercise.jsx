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
