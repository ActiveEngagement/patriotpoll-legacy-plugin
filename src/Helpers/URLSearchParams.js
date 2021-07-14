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

function toJson(merge = {}) {
    return Array.from(entries())
        .reduce((obj, [key, value]) => (Object.assign(obj, {
            [key]: value
        })), merge);
}

function mailingId() {
    return  get('mailing_id') || get('mailingid') || get('mid');
}

function source() {
    return get('source') || get('src') || get('utm_source');
}

function trackingId() {
    return get('tracking_id') || get('tid') || get('trackingid');
}

export {
    entries,
    get,
    getAll,
    mailingId,
    source,
    toJson,
    trackingId,
    values
};