export default class Pattern {

    constructor(regex, identifier) {
        this.regex = regex;
        this.identifier = identifier;
    }

    match(value) {
        return value ? value.match(this.regex) : null;
    }

    id(strategy) {
        if((this.identifier instanceof Function) && strategy.matches) {
            return this.identifier(strategy);
        }

        return strategy.matches && strategy.matches[this.identifier] ? strategy.matches[this.identifier] : null;
    }

    toJSON() {
        return this.regex ? this.regex.toString() : null;
    }

}
