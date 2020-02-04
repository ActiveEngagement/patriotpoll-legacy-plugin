import Pattern from '../Helpers/Pattern';
import Strategy from '../Helpers/Strategy';

export default class Twitter extends Strategy {

    get embed() {
        return {
            component: 'twitter',
            props: {
                id: this.id,
                handle: this.handle
            }
        };
    }

    static patterns() {
        return [
            new Pattern(/https?:\/\/(www\.)?twitter\.com\/(\w+)\/status\/(\w+)$/, strategy => {
                strategy.handle = strategy.matches[2];

                return strategy.matches[3];
            })
        ];
    }
}
