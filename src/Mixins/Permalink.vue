<script>
export default {
    
    props: {
        permalink: {
            type: Function,
            default({ permalink }) {
                return permalink;
            }
        }
    },

    methods: {
        onClickPermalink(poll) {
            const path = this.permalink(this.nextPoll);
            
            if(this.$router) {
                this.$router.push(path);
            }
            else {
                window.location = path;
            }
        }
    }

};
</script>