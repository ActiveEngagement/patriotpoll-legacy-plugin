import Pattern from '../Helpers/Pattern';
import Strategy from '../Helpers/Strategy';

export default class YouTube extends Strategy {

    get embed() {
        return {
            component: 'youtube',
            props: {
                id: this.id
            }
        };
    }

    static patterns() {
        return [
            new Pattern(/https?:\/\/(www\.)?youtu\.be\/(\w+)(&.+)?$/, 2),
            new Pattern(/https?:\/\/(www\.)?youtube(-nocookie)?.com\/embed\/([\w-_]+)\??(.+)?$/, 3),
            new Pattern(/https?:\/\/(www\.)?youtube?.com\/watch\?(.+)?v=([\w-_]+)(&.+)?$/, 3)
        ];
    }
}
