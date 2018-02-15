//@flow
import React from 'react';
import type {Element} from 'react';
import {connect} from 'react-redux';
import {Some} from 'fronads';
import {Box} from 'obtuse';

import ExerciseActions from '../data/ExerciseActions';
import ExerciseNavigation from './ExerciseNavigation';
const {meta, navigation, interaction, step} = ExerciseActions.exercise;

class ModuleSteps extends React.Component<Object> {
    static defaultProps = {
        navigation: ExerciseNavigation
    }
    constructor(props: Object) {
        super(props);
        const {addSteps, steps, value} = props;

        if(value.steps.size === 0) {
            addSteps(steps);
        }
    }
    render(): ?Element<*> {
        const {
            navigation: Navigation,
            onFinish,
            onGoto,
            onNext,
            onPrevious,
            onProgress,
            onScore,
            onAnswer,
            onSetSubmitable,
            value,
            loader
        } = this.props;

        if(value.steps.size) {
            const step = value.getIn(['steps', value.step]);
            const childProps = {
                value,
                loader,
                step,
                actions: {
                    onFinish,
                    onGoto,
                    onNext,
                    onPrevious,
                    onProgress,
                    onScore,
                    onAnswer,
                    onSetSubmitable
                }
            };

            const renderableStep = this.props.steps[value.step];
            if(!renderableStep.render) {
                console.log('No render method found on', renderableStep);
            }

            return <Box>
                <Navigation {...childProps} />
                <Box modifier="paddingTopMega">
                    {renderableStep.render(childProps)}
                </Box>
            </Box>;
        }

        return null;
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
            onProgress: navigation.progressStep
        }
    ))
    .value();
