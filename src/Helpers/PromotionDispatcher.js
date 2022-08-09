export default class PromotionDispatcher {

    constructor(component, source) {
        this.component = component;
        this.source = source;

        this.dispatched = {
            load: [],
            convert: []
        };

        ['load', 'convert'].forEach(trigger => {
            this.component.$on(trigger, ({ promotions }) => {
                const matches = this.find(promotions, {
                    source
                });

        
                this.dispatch(trigger, matches);
            });
        });
    }
    
    find(promotions, properties) {
        return promotions ? promotions.filter(entry => {
            return Object.keys(properties).every(key => {
                return entry[key] === properties[key];
            });
        }) : [];
    }

    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    hasDispatched(trigger, promotion) {
        return this.find(this.dispatched[trigger], promotion).length;
    }
    
    dispatchScript(trigger, promotion) {
        const node = document.createElement('div');

        node.innerHTML = promotion[`${trigger}_code`];

        while(node.children.length) {
            document.body.appendChild(node.children[0]);
        }
    }

    dispatchImg(trigger, promotion) {        
        const node = document.createElement('div');

        node.innerHTML = promotion[`${trigger}_code`];

        while(node.children.length) {
            document.body.appendChild(node.children[0]);
        }
    }

    dispatch(trigger, matches) {
        matches.forEach(promotion => {
            if(!this.hasDispatched(trigger, promotion)) {
                const method = 'dispatch' + this.capitalize(promotion[`${trigger}_type`]);
    
                this[method](trigger, promotion);
    
                this.dispatched[trigger].push(promotion);
            }
        });
    }

}