import Pattern from '../Helpers/Pattern';
import Strategy from '../Helpers/Strategy';

export default class Facebook extends Strategy {

    get embed() {
        return {
            component: 'facebook',
            props: {
                id: this.id,
                handle: this.handle
            }
        };
    }

    static patterns() {
        return [
            new Pattern(/https?:\/\/(www\.)?facebook?.com\/([\w_-]+)\/posts\/([\w_-]+)(\?.+)?$/, strategy => {
                strategy.handle = strategy.matches[2];

                return strategy.matches[3];
            })
        ];
    }
}
