//@flow
import {SCORM} from 'pipwerks-scorm-api-wrapper';
import {Perhaps, Maybe} from 'fronads';
import pako from 'pako';

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

export function score(value: string): Maybe<string> {
    return Perhaps(SCORM.set('cmi.core.score.raw', value));
}

export function status(): string {
    return Perhaps(SCORM.get('cmi.core.lesson_status'));
}

export function setStatus(value: string): Maybe<string> {
    return Perhaps(SCORM.set('cmi.core.lesson_status', value));
}

export function suspendData(): Object {
    let data = SCORM.get('cmi.suspend_data');
    try {
        return JSON.parse(pako.inflate(data, { to: 'string' }));
    } catch(e) {
        return {};
    }
}

export function setSuspendData(value: *): Maybe<string> {
    var encoded = pako.deflate(JSON.stringify(value), { to: 'string' });
    console.log(encoded.length,encoded)
    return Perhaps(SCORM.set('cmi.suspend_data', encoded));
}

export function interaction(): string {
    return SCORM.get('cmi.interactions._count') || "0";
}

export function setInteractionID({num, title}: Object): Maybe<string> {
    return Perhaps(SCORM.set('cmi.interactions.'+num+'.id', title));
}

export function setInteractionStudentResponse({num, answer}: Object): Maybe<string> {
    return Perhaps(SCORM.set('cmi.interactions.'+num+'.student_response', answer));
}

export function setInteractionResult({num, result}: Object): Maybe<string> {
    return Perhaps(SCORM.set('cmi.interactions.'+num+'.result', result));
}

export function setInteractionCorrectResponse({num, correctAnswer}: Object): Maybe<string> {
    return Perhaps(SCORM.set('cmi.interactions.'+num+'.correct_responses.0.pattern', correctAnswer));
}

export function setInteractionLatency({num, time}: Object): Maybe<string> {
    return Perhaps(SCORM.set('cmi.interactions.'+num+'.latency', time));
}

export function complete(value?: string): string {
    if(typeof value === "string") {
        return setStatus('passed')
            // $FlowFixMe: flow cant seem to work out that this value will never be null
            .flatMap(() => score(value))
            .value();
    }
    return setStatus('completed').value();
}

export function fail(value: string): string {
    return setStatus('failed')
        .flatMap(() => score(value))
        .value();
}
