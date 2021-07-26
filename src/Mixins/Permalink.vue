<script>
import { toJson } from '../Helpers/URLSearchParams';

export default {

    directives: {

        permalink(el, { value, native }, { context, componentInstance }) {
            if(!native && componentInstance) {
                componentInstance.$on('click', () => {
                    context.onClickPermalink(value);
                });
            }
            else {
                if(el.tagName === 'A' && !el.getAttribute('href')) {
                    const url = new URL(context.permalink(value), window.location.toString());

                    url.search = window.location.search;

                    el.setAttribute('href', url.toString());
                }

                if(el.permalinkClickCallback) {
                    el.removeEventListener('click', el.permalinkClickCallback);
                }

                el.addEventListener('click', el.permalinkClickCallback = e => {
                    context.onClickPermalink(value);

                    e.preventDefault();
                });
            }
        }

    },
    
    props: {
        permalink: {
            type: Function,
            default(poll) {
                return poll && poll.permalink;
            }
        }
    },

    methods: {

        routeToPermalink(permalink) {

            if(this.$router && !permalink.match(/^http/)) {
                const [ path, hash ] = permalink.split('#');

                this.$router.push({
                    path,
                    hash,
                    query: Object.assign({}, toJson(), {
                        answer: undefined,
                        submit: undefined
                    })
                }).catch(e => {
                    window.location = permalink;
                });
            }
            else {
                window.location = permalink;
            }
        },

        onClickPermalink(poll) {
            this.routeToPermalink(this.permalink(poll));
        }
        
    }

};
</script>