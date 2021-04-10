import { debounce } from '@vue-interface/utils';

const debouncer = debounce((fn, ...args) => {
    return fn(...args);
}, 250);

const attrs = [
    'border-left-width',
    'border-right-width',
    'padding-left',
    'padding-right',
    'margin-left',
    'margin-right'
];

function unit(value) {
    return parseFloat(value.replace('px', ''));
}

function width(el) {
    const style = window.getComputedStyle(el);

    return unit(style.getPropertyValue('width'));
}

function spaceWidth(el) {
    const style = window.getComputedStyle(el);

    return attrs.reduce((carry, attr) => {
        return carry + unit(style.getPropertyValue(attr));
    }, 0);
}

function textWidth(el, selector) {
    return [].slice.call(el.querySelectorAll(selector))
        .filter(child => child instanceof Element)
        .reduce((carry, child) => {
            return [].slice.call(child.getClientRects())
                .reduce((carry, child) => {
                    return carry + child.width;
                }, carry);
        }, 0);
}

function doesTextOverflow(el, selector) {
    // Get an array of child Elements.
    const children = [].slice.call(el.children)
        .filter(child => child instanceof Element);

    for(const x in children) {
        // Extract the child from the array.
        const child = children[x];

        // The offset used to divide the child width to determine if the text
        // is wider than the container.
        let offset = 1;

        // If the container and the child elements are the same height
        // calculate, then divide the value by the number of children and assume
        // the children are equal widths.
        if(width(el) === width(child)) {
            offset = children.length;
        }

        if(width(child) / offset < spaceWidth(child) + textWidth(child, selector)) {
            return true;
        }
    }

    return false;
}

function doesHaveLineBreaks(el, selector) {
    // Get an array of child Elements.
    const children = [].slice.call(el.children)
        .filter(child => child instanceof Element);

    for(const x in children) {
        for(const child of children[x].querySelectorAll(selector)) {
            if(child.getClientRects().length > 1) {
                return true;
            }
        }
    }
    
    return false;
}

function resize(el, binding, vnode) {
    const isObject = binding.value instanceof Object;

    const options = Object.assign({
        selector: !isObject ? binding.value : null
    }, isObject ? binding.value : null);

    if(!options.selector) {
        throw new Error('A CSS selector pointing to the inline text elements is required.');
    }

    const containerWidth = unit(
        window.getComputedStyle(el).getPropertyValue('width')
    );

    const calculatedWidth = [].slice.call(el.children).reduce((carry, el) => {
        return carry + spaceWidth(el) + textWidth(el, options.selector);
    }, 0);

    const roundedCalculatedWidth = Math.round(calculatedWidth * 100) / 100;

    const event = new Event('resize');

    Object.assign(event, {
        containerWidth: containerWidth,
        calculatedWidth: roundedCalculatedWidth,
        doesTextOverflow: doesTextOverflow(el, options.selector),
        doesHaveLineBreaks: doesHaveLineBreaks(el, options.selector),
        doesCalculatedWidthExceedContainer: roundedCalculatedWidth > containerWidth
    });
    
    el.dispatchEvent(event);

    return resize;
}

export default {

    bind(el, binding, vnode) {
        if(!!binding.value) {
            window.addEventListener('resize', () => debouncer(() => {
                resize(el, binding, vnode);
            }));
        }
    },

    inserted(el, binding, vnode) {
        if(!!binding.value) {
            resize(el, binding, vnode);
        }
    },

    unbind(el, binding) {
        if(!!binding.value) {
            window.removeEventListener('resize', resize);
        }
    },

};
