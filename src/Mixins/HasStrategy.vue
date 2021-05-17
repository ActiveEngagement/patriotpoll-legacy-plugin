<script>
import match from '../Helpers/match';
import Strategy from '../Helpers/Strategy';

export default {

    props: {
        
        url: String,

        poll: Object,

        width: {
            type: Number
        }

    },

    computed: {

        strategy() {
            let strategy = null;
            
            
            if(this.url) {
                return match(this.url);
            }
            
            if(this.form && this.form.options) {
                strategy = this.form.options.strategy;
            }
            else if(this.poll && this.poll.options) {
                strategy = this.poll.options.strategy;
            }

            if(!(strategy instanceof Strategy) && strategy) {
                strategy = match(strategy.url);
            }
            else {
                strategy = match(this.poll.url);
            }

            return strategy;
        }

    }

};
</script>
