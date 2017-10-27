
export function loadState(key) {
    try {
        const state = localStorage.getItem(key);
        if(state === null) {
            return undefined;
        }
        return JSON.parse(state);
    } catch(error) {
        return undefined;
    }
}

export function saveState(key, value) {
    try {
        const state = JSON.stringify(value);
        localStorage.setItem(key, state);
    } catch (error) {
        console.error(error);
    }
}
