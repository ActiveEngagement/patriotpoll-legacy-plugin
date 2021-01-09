import Pattern from './Pattern';
import * as Strategies from '../Strategies';

export default function match(url) {
    for(let i in Strategies) {
        const Strategy = Strategies[i];
        const patterns = Strategy.patterns();

        for(let i in patterns) {
            const obj = patterns[i];

            // If the obj is not an instance of Pattern, then continue...
            if(!(obj instanceof Pattern)) {
                continue;
            }

            const strategy = Strategy.make(url, obj);

            if(strategy.matches) {
                return strategy;
            }
        }
    }

    return null;
}
