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
            default({ permalink }) {
                return permalink;
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
            this.routeToPermalink(this.permalink(this.nextPoll));
        }
        
    }

};
</script>