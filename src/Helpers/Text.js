/**
 * Convert a string to a numerical pixel unit.
 * 
 * @param {string} value 
 * @returns {number}
 */
function unit(value) {
    return parseFloat(value.replace('px', '') || 0);
}

/**
 * Get the spacial width of an element.
 * 
 * @param {HTMLElement} el
 * @returns {number}
 */
function spacialWidth(el) {
    const style = window.getComputedStyle(el);

    const attrs = [
        'border-left-width',
        'border-right-width',
        'padding-left',
        'padding-right',
        'margin-left',
        'margin-right'
    ];
    
    return attrs.reduce((carry, attr) => {
        return carry + unit(style.getPropertyValue(attr));
    }, 0);
}

/**
 * Determine if an element's children causes textual overflow.
 * 
 * @param {HTMLElement} el 
 * @param {string} selector
 * @returns {boolean}
 */
function hasTextualOverflow(el) {
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

        if(width(child) / offset < spacialWidth(child) + textualWidth(child)) {
            return true;
        }
    }

    return false;
}

/**
 * Get to see if the element's children causes line breaks.
 * 
 * @param {HTMLElement} el 
 * @param {string} selector 
 * @returns 
 */
function hasLineBreaks(el) {
    return totalLineBreaks(el) > 1;
}

/**
 * Get the textual width of an element.
 * 
 * @param {HTMLElement} el 
 * @param {string} selector 
 * @returns 
 */
function textualWidth(el) {
    return [].slice.call(el.children.length ? el.children : [el])
        .filter(child => child instanceof Element)
        .reduce((carry, child) => {
            return [].slice.call(child.getClientRects())
                .reduce((carry, child) => {
                    return carry + child.width;
                }, carry);
        }, 0);
}

/**
 * Get to total number of line breaks.
 * 
 * @param {HTMLElement} el 
 * @returns 
 */
function totalLineBreaks(el) {
    let total = 0;

    for(const child of el.childNodes) {
        try {
            total += child.getClientRects().length;
        }
        catch (e) {
            total += 1;
        }
    }
    
    return total;
}

/**
 * Get the width of an element.
 * 
 * @param {HTMLElement} el 
 * @returns {number}
 */
function width(el) {
    const style = window.getComputedStyle(el);

    return unit(style.getPropertyValue('width'));
}

export {
    hasLineBreaks,
    hasTextualOverflow,
    spacialWidth,
    textualWidth,
    totalLineBreaks,
    unit,
    width
};