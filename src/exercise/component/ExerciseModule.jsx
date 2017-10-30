/* @flow */
import React from 'react';
import {Wrapper} from 'obtuse';
import Exercise from './Exercise';
import EndStep from './EndStep';
import PdfStep from './PdfStep';
import VideoStep from './VideoStep';
import QuizStep from './QuizStep';


export default function ExerciseModule(props) {
    function getRender(step, file) {
        switch (step.type) {
            case 'video':
                return (props) => <VideoStep {...props} file={file}/>;

            case 'document':
                return (props) => <PdfStep {...props} file={file}/>;

            case 'quiz':
                return (props) => <Wrapper>
                    <QuizStep {...props} quiz={file}/>
                </Wrapper>;

            case 'assessment':
                return (props) => <EndStep {...props} passRate={step.passRate} />;

            default:
                if(props[step.type]) {
                    const Component = props[step.type];
                    return (props) => <Component {...props} {...step} />
                } else {
                    console.warn('No render method found for', step.type);
                }

        }
    }

    const steps = props.steps
        .map(step => {
            let file;
            if(step.file) {
                file = props.context(`./${step.file}`);
            }
            step.render = getRender(step, file)
            return step;
        });


    return <Exercise steps={steps} />;
};
