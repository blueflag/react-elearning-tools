//@flow
import {SCORM} from 'pipwerks-scorm-api-wrapper';
import {Perhaps} from 'fronads';

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

export function setStatus(value: string): string {
    return Perhaps(SCORM.set('cmi.core.lesson_status', value));
}

export function complete(value: string): boolean {
    return setStatus('completed')
        .flatMap(() => score(value));
}

export function fail(value: string): boolean {
    return setStatus('failed')
        .flatMap(() => score(value));
}
