//@flow

const methods = [
    'version',
    'LMSInitialize',
    'LMSFinish',
    'LMSGetValue',
    'LMSSetValue',
    'LMSCommit',
    'LMSGetLastError',
    'LMSGetErrorString',
    'LMSGetDiagnostic'
];

function Logger(...args) {
    console.log('%c[Scorm]:', 'color: #9a55da;', ...args);
}

export default function ScormLogger() {
    if(!window.API) {
        Logger('Warning. No window.API was found');
        return false;
    }

    methods.reduce((win: Object, method: string): Object => {
        const oldMethod = win[method];
        win[method] = (...args) => {
            var returnValue;
            // console.log(oldAPI, oldMethod);
            if(oldMethod) {
                returnValue = oldMethod(...args);
            }
            Logger(`${method}(${args.join(', ')}) =>`, returnValue);
            return returnValue;
        };
        return win;
    }, window.API);
}
