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

export default function ScormLogger() {
    const oldAPI = window.API;

    window.API = window.API || {};

    methods.reduce((win, method) => {
        win[method] = (...args) => {
            console.log('Scorm', method, ...args);
            oldAPI[method](...args);
        }
    }, window.API);
}
