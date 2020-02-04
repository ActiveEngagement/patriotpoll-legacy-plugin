import * as Strategies from '../Strategies';

export default function match(url) {
    for(let i in Strategies) {
        const Strategy = Strategies[i];
        const patterns = Strategy.patterns();

        for(let i in patterns) {
            const strategy = Strategy.make(url, patterns[i]);

            if(strategy.matches) {
                return strategy;
            }
        }
    }

    return null;
}
