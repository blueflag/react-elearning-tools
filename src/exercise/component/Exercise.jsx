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
    components: Object,
    navigation: ComponentType<*>,
    onNext: Function,
    onScore: Function,
    onFinish: Function,
    onPrevious: Function,
    onGoto: Function,
    onAnswer: Function,
    onSetSubmitable: Function,
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
            components = {},
            navigation: Navigation,
            onNext,
            onScore,
            onFinish,
            onPrevious,
            onGoto,
            onAnswer,
            onSetSubmitable,
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
                onScore,
                onFinish,
                onPrevious,
                onGoto,
                onAnswer,
                onSetSubmitable,
                onStepSetState,
                onProgress
            },
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
            <Box modifier="paddingRowKilo">
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
            onScore: interaction.score,
            onFinish: interaction.finish,
            onPrevious: navigation.previousStep,
            onGoto: navigation.gotoStep,
            onAnswer: interaction.answer,
            onSetSubmitable: step.setSubmitable,
            onStepSetState: step.setState,
            onProgress: navigation.progressStep
        }
    ))
    .value();
