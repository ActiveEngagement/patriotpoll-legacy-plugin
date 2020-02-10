<script>
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
                    el.setAttribute('href', context.permalink(value));
                }

                el.addEventListener('click', e => {
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
            if(this.$router) {
                this.$router.push(permalink);
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