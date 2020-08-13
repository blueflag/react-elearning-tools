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
    onStepSetQuestions: Function,
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
            window.scroll(0, 0);
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

    renderCheckIcon(): ?Element<*> {
        return <svg x="0px" y="0px" viewBox="0 0 213.3 214.9" width="30" height="30" fill="white" className="Icon">
            <path d="M152.2,139.5v22.5c0,4.6-3.8,8.3-8.3,8.3H43.7c-4.6,0-8.3-3.8-8.3-8.3V61.9c0-4.6,3.8-8.3,8.3-8.3h88.9l14.6-14.6
            c-3.8-1.3-7.5-2.1-11.7-2.1H52c-18.4,0-33.4,15-33.4,33.4v83.5c0,18.4,15,33.4,33.4,33.4h83.5c18.4,0,33.4-15,33.4-33.4v-30.9
            L152.2,139.5z"
            />
            <path d="M201.5,57.3c1.7,1.7,1.7,4.2,0,5.8L109.6,155c-1.7,1.7-4.2,1.7-5.8,0l-49.3-49.3c-1.7-1.7-1.7-4.2,0-5.8l19.6-19.6
            c1.7-1.7,4.2-1.7,5.8,0l23.8,23.8c1.7,1.7,4.2,1.7,5.8,0L176,37.7c1.7-1.7,4.2-1.7,5.8,0L201.5,57.3z"
            />
        </svg>;
    }

    renderDownloadIcon(): ?Element<*> {
        return <svg viewBox="12 12 24 24" width="15" height="15" fill="white">
            <g>
                <path d="M33,29v2h-8.427l7.37-8.588C32.102,22.207,32.02,22,31.761,22H27v-9.511C27,12.229,26.804,12,26.545,12h-5.024
        C21.262,12,21,12.229,21,12.489V22h-4.681c-0.26,0-0.343,0.208-0.184,0.413L23.507,31H15v-2h-3v6c0,0.55,0.45,1,1,1h22
        c0.55,0,1-0.45,1-1v-6H33z"
                />
            </g>
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
            onStepSetQuestions,
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
            CheckIcon: () => this.renderCheckIcon(),
            DownloadIcon: () => this.renderDownloadIcon(),
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
                onStepSetQuestions,
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
            onStepSetQuestions: step.setQuestions,
            onStepSetState: step.setState,
            onProgress: navigation.progressStep
        }
    ))
    .value();
