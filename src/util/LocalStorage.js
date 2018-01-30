//@flow

export function loadState(key: string): * {
    try {
        const state = localStorage.getItem(key) || '';
        if(state === null) {
            return undefined;
        }
        return JSON.parse(state);
    } catch(error) {
        return undefined;
    }
}

export function saveState(key: string, value: *) {
    try {
        const state = JSON.stringify(value);
        localStorage.setItem(key, state);
    } catch (error) {
        console.error(error);
    }
}
