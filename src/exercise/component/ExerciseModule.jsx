//@flow
import React from 'react';
import type {Element} from 'react';
import MobileDetect from 'mobile-detect';
import CoverStep from './CoverStep';
import EndStep from './EndStep';
import Exercise from './Exercise';
import MarkdownStep from './MarkdownStep';
import PdfStep from './PdfStep';
import PdfStepMobile from './PdfStepMobile';
import QuizStep from './QuizStep';
import VideoStep from './VideoStep';

type Props = {
    steps: Array<Object>,
    components?: Object,
    context: Function,
    scorm: {
        masteryScore: number,
        navigationLock: boolean
    },
    [key: string]: *
};

export default function ExerciseModule(props: Props): Element<*> {

    function getRender(step: Object, file: *): * {
        let mobileDetect = new MobileDetect(window.navigator.userAgent);
        switch (step.type) {
            case 'video':
                return (childProps) => <VideoStep {...childProps} file={file}/>;

            case 'document':
                if(mobileDetect.mobile() && !mobileDetect.tablet()){
                    return (childProps) => <PdfStepMobile {...childProps} file={file}/>;
                } else {
                    return (childProps) => <PdfStep {...childProps} file={file}/>;
                }

            case 'markdown':
                return (childProps) => <MarkdownStep {...childProps} file={file}/>;

            case 'quiz':
                return (childProps) =>  <QuizStep {...childProps} quiz={file} questions={step.questions} />;

            case 'cover':
                return (childProps) => <CoverStep {...childProps} title={step.title} description={step.description} file={file} />;

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
                    return (props) => <Component {...props} {...step} />;
                } else {
                    console.error('No render method found for', step.type);
                }

        }
    }

    function selectQuizFile(file: Array<string>): * {
        var num = Math.floor(Math.random() * Math.floor(file.length));
        return file[num];
    }

    const steps = props.steps
        .map((step: Object): Object => {
            let file;
            if(step.file) {
                file = props.context(`./${step.file}`);
            } else {
                if(step.fileOneOf && step.type === 'quiz'){
                    const mainFile = selectQuizFile(step.fileOneOf);
                    step.file = mainFile;
                    file = props.context(`./${step.file}`);
                }
            }
            step.render = getRender(step, file);
            return step;
        });
    

    return <Exercise
        steps={steps}
        scorm={props.scorm}
        components={props.components}
    />;
}
