//@flow


class ScormDevelopmentRuntime {
    constructor() {
        window.API = this;
        this.data = {
            'cmi.core.lesson_status': 'incomplete',
            'cmi.core.student_name': 'Derek Tibbs',
            'cmi.interactions._count' : "0",
        };
        this.LMSGetValue = this.LMSGetValue.bind(this);
        this.LMSSetValue = this.LMSSetValue.bind(this);
    }
    version() {
        return '1.2';
    }
    LMSInitialize() {
        return true;
    }
    LMSFinish() {
        return true;
    }
    LMSGetValue(key) {
        return this.data[key];
    }
    LMSSetValue(key, value) {
        this.data[key] = value;
        return true;
    }
    LMSCommit() {
        return true;
    }
    LMSGetLastError() {
        return 0;
    }
    LMSGetErrorString() {
        return 'No Error';
    }
    LMSGetDiagnostic() {
        return 'There are no errors in the development runtime';
    }
}


export default function ScormDevelopmentRuntimeFactory(): ScormDevelopmentRuntime {
    return new ScormDevelopmentRuntime();
}
