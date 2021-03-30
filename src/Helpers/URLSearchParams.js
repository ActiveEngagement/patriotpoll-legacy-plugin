let params = new URLSearchParams(window.location.search);

function entries(...args) {
    return params.entries(...args);
}

function get(...args) {
    return params.get(...args);
}

function getAll(...args) {
    return params.getAll(...args);
}

function values(...args) {
    return params.values(...args);
}

function toJson() {
    return Array.from(entries())
        .reduce((obj, [key, value]) => (Object.assign(obj, {
            [key]: value
        })), {});
}

export {
    entries,
    get,
    getAll,
    toJson,
    values
};