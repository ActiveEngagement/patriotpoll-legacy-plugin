import Pattern from './Pattern';

export default class Strategy {

    constructor(url, pattern) {
        if(!(pattern instanceof Pattern)) {
            throw new Error('Second argument must be an instance of Pattern.');
        }

        this.url = url;
        this.pattern = pattern;
        this.matches = pattern.match(url);
        this.id = pattern.id(this);
    }

    toJSON() {
        return Object.assign({
            embed: this.embed
        }, this);
    }

    get embed() {
        return null;
    }

    static patterns() {
        return [];
    }

    static make(url, pattern) {
        return new this(url, pattern);
    }

}
