//@flow
import {SCORM} from 'pipwerks-scorm-api-wrapper';
import {Perhaps, Maybe} from 'fronads';

export function initialize(): boolean {
    return Perhaps(SCORM.init());
}

export function terminate(): boolean {
    return Perhaps(SCORM.quit());
}


export function get(key: string): any {
    return Perhaps(SCORM.get(key));
}



//
// Predefined Methods

export function score(value: string): boolean {
    return Perhaps(SCORM.set('cmi.core.score.raw', value))
}

export function status(): string {
    return Perhaps(SCORM.get('cmi.core.lesson_status'));
}

export function setStatus(value: string): Maybe<string> {
    return Perhaps(SCORM.set('cmi.core.lesson_status', value));
}

export function complete(value: string): string {
    if(value === 0) {
        return setStatus('completed').value();
    }
    return setStatus('passed')
        .flatMap(() => score(value))
        .value();
}

export function fail(value: string): string {
    return setStatus('failed')
        .flatMap(() => score(value))
        .value();
}
