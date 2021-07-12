<template>
    <canvas width="100%" :height="height" />
</template>

<script>
import Chart from 'chart.js';
import randomcolor from 'randomcolor';

export default {

    props: {

        poll: {
            type: Object,
            required: true
        },

        height: {
            type: Number,
            value: 300
        },

        circle: {
            type: Boolean,
            default: false
        }

    },

    data() {
        return {
            chart: null
        };
    },

    mounted() {
        const entries = Object.entries(this.poll.statistics.breakdown);
       
        const data = entries.map(([ label, breakdown ]) => {
            return Math.round(breakdown.percentage, 2);
        });

        const labels = entries.map(([ label, breakdown ]) => {
            return `${label}`;
        });

        this.chart = new Chart(this.$el, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: this.colors(data.length),
                }]
            },
            options: {
                legend: {
                    labels: {
                        fontSize: 16
                    }
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            const label = data.labels[tooltipItem.index];
                            const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

                            return `${label} ${value}%`;
                        }
                    }
                },
                circumference: (this.circle ? 2 : 1) * Math.PI,
                rotation: -Math.PI / (this.circle ? 2 : 1),
            }
        });
    },

    methods: {
        colors(count, options) {
            return randomcolor(Object.assign({
                count: count
            }, options));
        },
    }

};
</script>