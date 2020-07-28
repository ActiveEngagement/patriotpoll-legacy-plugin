<template>
    <canvas width="400" height="400" />
</template>

<script>
import Color from 'color';
import Chart from 'chart.js';
import randomcolor from 'randomcolor';

export default {

    name: 'PollDounutChart',

    props: {

        poll: {
            type: Object,
            required: true
        }

    },

    data() {
        return {
            chart: null
        };
    },

    mounted() {
        const data = {
            datasets: [{
                data: [10, 20, 30],
                backgroundColor: this.colors(3),
            }], 
            
            labels: [
                'Red',
                'Yellow',
                'Blue'
            ]
        };


        // For a pie chart
        this.chart = new Chart(this.$el, {
            type: 'pie',
            data,
        });
    },

    methods: {
        colors(count, options) {
            return randomcolor(Object.assign({
                luminosity: 'light',
                count: count
            }, options));
        },
    }

};
</script>