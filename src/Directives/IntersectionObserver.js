import result from 'lodash/result';

export default {
    inserted(el, binding, vnode) {
        const options = result(binding, 'value', {
            threshold: binding.arg ? parseFloat(binding.arg) : undefined
        });

        new IntersectionObserver((entries, observer) => {
            const event = new Event('intersect');

            Object.assign(event, {
                entries: entries,
                observer: observer
            });

            el.dispatchEvent(event);
        }, options).observe(el);
    }
};
