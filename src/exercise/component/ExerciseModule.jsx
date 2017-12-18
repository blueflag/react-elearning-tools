/* @flow */
import React from 'react';
import {Wrapper} from 'obtuse';
import CoverStep from './CoverStep';
import EndStep from './EndStep';
import Exercise from './Exercise';
import MarkdownStep from './MarkdownStep';
import PdfStep from './PdfStep';
import QuizStep from './QuizStep';
import VideoStep from './VideoStep';


export default function ExerciseModule(props: Object) {

    function getRender(step, file) {
        switch (step.type) {
            case 'video':
                return (childProps) => <VideoStep {...childProps} file={file}/>;

            case 'document':
                return (childProps) => <PdfStep {...childProps} file={file}/>;

            case 'markdown':
                return (childProps) => <MarkdownStep {...childProps} file={file}/>;

            case 'quiz':
                return (childProps) => <QuizStep {...childProps} quiz={file}/>;

            case 'cover':
                return (childProps) => <CoverStep {...childProps} title={step.title} description={step.description} />;

            case 'assessment':
                return (childProps) => <EndStep
                    {...childProps}
                    masteryScore={props.scorm.masteryScore}
                    passRate={step.passRate}
                    description={step.description}
                    failDescription={step.failDescription}
                />;

            default:
                if(props[step.type]) {
                    const Component = props[step.type];
                    return (props) => <Component {...props} {...step} />
                } else {
                    console.error('No render method found for', step.type);
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
