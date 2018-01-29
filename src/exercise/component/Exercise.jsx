import React from 'react';
import {connect} from 'react-redux';
import {List} from 'immutable';
import {Record} from 'immutable';
import ScormDevelopmentRuntime from '../../ScormDevelopmentRuntime';
import ScormLogger from '../../ScormLogger';
import * as scorm from '../../scorm';
import {Some} from 'fronads';
import {Box} from 'obtuse';


import ExerciseActions from '../data/ExerciseActions';
import ExerciseNavigation from './ExerciseNavigation';
const {meta, navigation, interaction, step} = ExerciseActions.exercise;


class ModuleSteps extends React.Component {
    static defaultProps = {
        navigation: ExerciseNavigation
    }
    constructor(props) {
        super(props);
        const {addSteps, steps, value} = props;

        scorm.initialize();
        scorm.status();

        if(value.steps.size === 0) {
            addSteps(steps);
        }
    }
    render() {
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
        } = this.props;

        if(value.steps.size) {
            const step = value.getIn(['steps', value.step]);
            const childProps = {
                value,
                step,
                actions: {
                    onAnswer,
                    onSetSubmitable,
                    onFinish,
                    onGoto,
                    onNext,
                    onPrevious,
                    onProgress,
                    onScore,
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
            </Box>
        }

        return null;
    }
}

export default Some(ModuleSteps)
    .map(connect(
        (value) => ({value}),
        {
            addSteps: meta.addSteps,
            onAnswer: interaction.answer,
            onSetSubmitable: step.setSubmitable,
            onNext: navigation.nextStep,
            onScore: interaction.score,
            onFinish: interaction.finish,
            onPrevious: navigation.previousStep,
            onGoto: navigation.gotoStep,
            onProgress: navigation.progressStep
        }
    ))
    .value();
