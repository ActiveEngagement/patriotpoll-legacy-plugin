export default class PixelDispatcher {

    constructor(component, source) {
        this.component = component;
        this.source = source;
        this.dispatched = [];

        ['load', 'convert'].forEach(trigger => {
            this.component.$on(trigger, ({ pixels }) => {
                const matches = this.find(pixels, {
                    source,
                    trigger,
                });

                this.dispatch(matches);
            });
        });
    }
    
    find(pixels, properties) {
        return pixels ? pixels.filter(entry => {
            return Object.keys(properties).every(key => {
                return entry[key] === properties[key];
            });
        }) : [];
    }

    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    hasDispatched(pixel) {
        return this.find(this.dispatched, pixel).length;
    }
    
    dispatchScript(pixel) {
        const node = document.createElement('div');

        node.innerHTML = pixel.code;

        return [].map.call(node.children, child => {
            return new Promise(resolve => {
                const script = document.createElement('script');
            
                script.appendChild(document.createTextNode(child.innerHTML));

                document.body.appendChild(script);

                resolve(script);
            });
        });
    }

    dispatchImg(pixel) {        
        const node = document.createElement('div');

        node.innerHTML = pixel.code;

        return [].map.call(node.children, child => {
            return new Promise(resolve => {
                node.children.forEach(child => {
                    document.body.append(child);
                });
                
                resolve(node.children);
            });
        });
    }

    dispatch(matches) {
        matches.forEach(pixel => {
            if(!this.hasDispatched(pixel)) {
                const method = 'dispatch' + this.capitalize(pixel.type);

                this[method](pixel);

                this.dispatched.push(pixel);
            }
        });
    }

}