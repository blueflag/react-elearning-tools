//@flow
import {loadState, saveState} from './util/LocalStorage';

class ScormDevelopmentRuntime {
    data: Object;
    LMSGetValue: Function;
    LMSSetValue: Function;
    constructor() {
        window.API = this;
        this.data = {
            'cmi.core.lesson_status': 'incomplete',
            'cmi.core.student_name': 'Derek Tibbs',
            'cmi.interactions._count' : "0",
            'cmi.core.student_id': '1234',
            'cmi.suspend_data': ''
        };
        this.LMSGetValue = this.LMSGetValue.bind(this);
        this.LMSSetValue = this.LMSSetValue.bind(this);
    }
    version(): string {
        return '1.2';
    }
    LMSInitialize(): boolean {
        return true;
    }
    LMSFinish(): boolean {
        return true;
    }
    LMSGetValue(key: string): string {
        if(key === "cmi.suspend_data"){
            return loadState(key);
        }
        return this.data[key];
    }
    LMSSetValue(key: string, value: *): boolean {
        if(key === "cmi.suspend_data"){
            saveState(this.data['cmi.core.student_id'],value);
        }
        this.data[key] = value;
        return true;
    }
    LMSCommit(): boolean {
        return true;
    }
    LMSGetLastError(): number {
        return 0;
    }
    LMSGetErrorString(): string {
        return 'No Error';
    }
    LMSGetDiagnostic(): string {
        return 'There are no errors in the development runtime';
    }
}


export default function ScormDevelopmentRuntimeFactory(): ScormDevelopmentRuntime {
    return new ScormDevelopmentRuntime();
}
