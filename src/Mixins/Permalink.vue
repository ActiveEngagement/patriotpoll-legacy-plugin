<script>
export default {
    
    props: {
        permalink: {
            type: Function,
            default({ permalink }) {
                return permalink;
            }
        }
    }

};
</script>