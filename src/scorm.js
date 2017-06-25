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

export function status(): string {
    return Perhaps(SCORM.get('cmi.core.lesson_status'));
}

export function complete(): boolean {
    return Perhaps(SCORM.set('cmi.core.lesson_status', 'completed'));
}

export function fail(): boolean {
    return Perhaps(SCORM.set('cmi.core.lesson_status', 'failed'));
}
