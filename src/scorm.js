//@flow
import {SCORM} from 'pipwerks-scorm-api-wrapper';
import {Perhaps, Maybe} from 'fronads';

export function initialize(): boolean {
    return Perhaps(SCORM.init());
}

export function terminate(): boolean {
    return Perhaps(SCORM.quit());
}


export function get(key: string): Maybe<any> {
    return Perhaps(SCORM.get(key));
}


//
// Predefined Methods

export function score(value: string): Maybe<boolean> {
    return Perhaps(SCORM.set('cmi.core.score.raw', value));
}

export function status(): string {
    return Perhaps(SCORM.get('cmi.core.lesson_status'));
}

export function setStatus(value: string): Maybe<string> {
    return Perhaps(SCORM.set('cmi.core.lesson_status', value));
}

export function interaction(): string {
    return SCORM.get('cmi.interactions._count') || 0;
}

export function setInteractionID({num, title}): Maybe<string> {
    return Perhaps(SCORM.set('cmi.interactions.'+num+'.id', title));
}

export function setInteractionStudentResponse({num, answer}): Maybe<string> {
    return Perhaps(SCORM.set('cmi.interactions.'+num+'.student_response', answer));
}

export function setInteractionResult({num, result}): Maybe<string> {
    return Perhaps(SCORM.set('cmi.interactions.'+num+'.result', result));
}

export function setInteractionCorrectResponse({num, correctAnswer}): Maybe<string> {
    return Perhaps(SCORM.set('cmi.interactions.'+num+'.correct_responses.0.pattern', correctAnswer));
}

export function setInteractionLatency({num, time}): Maybe<string> {
    return Perhaps(SCORM.set('cmi.interactions.'+num+'.latency', time));
}

export function complete(value): string {
    if(value === null) {
        return setStatus('completed').value();
    }
    return setStatus('passed')
        .flatMap(() => score(value.toString()))
        .value();
}

export function fail(value): string {
    return setStatus('failed')
        .flatMap(() => score(value.toString()))
        .value();
}
