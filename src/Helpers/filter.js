export default function(...args) {
    return Object.fromEntries(
        Object.entries(Object.assign(...args)).filter(([ key, value ]) => {
            return value !== null && value !== undefined;
        })
    );
}