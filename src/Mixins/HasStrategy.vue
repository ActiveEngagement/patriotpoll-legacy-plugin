<script>
import { match, Strategy } from '../Helpers';

export default {

    props: {
        
        poll: {
            type: Object,
            required: true
        }

    },

    computed: {

        strategy() {
            let strategy = null;
            
            if(this.form && this.form.options) {
                strategy = this.form.options.strategy;
            }
            else if(this.poll && this.poll.options) {
                strategy = this.poll.options.strategy;
            }

            if(!(strategy instanceof Strategy)) {
                strategy = match(strategy.url);
            }

            return strategy;
        }

    }

};
</script>
