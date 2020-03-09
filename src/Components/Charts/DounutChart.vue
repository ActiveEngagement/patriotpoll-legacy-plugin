<template>
    <div class="patriotpoll-dounut-chart" :class="{'has-labels': !!labels}" />
</template>

<script>
import { arc } from 'd3';
import { pie } from 'd3';
//import { event } from 'd3';
import { mouse } from 'd3';
import { select } from 'd3';
import size from 'lodash/size';
// import Popper from 'popper.js';
import { interpolate } from 'd3';
import { scaleOrdinal } from 'd3';
import randomcolor from 'randomcolor';

export default {

    name: 'DounutChart',

    props: {
        width: Number,
        height: Number,
        data: {
            type: Array,
            required: true
        },
        offset: {
            type: Number,
            default: 32
        },
        padding: {
            type: Number,
            default: 0
        },
        labels: {
            type: [Boolean, Function],
            default() {
                return d => {
                    return `${d.data.answer} (${d.data.total})`;
                };
            },
            validate(value) {
                return (value instanceof Function) || !value;
            }
        }
    },

    data() {
        return {
            calculatedWidth: this.width,//this.$el.clientWidth,
            calculatedHeight: this.height//this.$el.clientHeight
        };
    },

    computed: {

        formattedData() {
            const data = [];

            for(let i in this.data) {
                const total = this.data[i].total;

                if(total) {
                    data.push({
                        answer: i,
                        total: total
                    });
                }
            }

            return data;
        },

        total() {
            return this.formattedData.reduce((carry, data) => {
                return carry += data.total;
            }, 0);
        }

    },

    beforeDestroy() {
        window.removeEventListener('resize', this.resize);
    },

    mounted() {
        window.addEventListener('resize', this.resize());

        this.render();
    },

    methods: {

        colors(count, options) {
            return randomcolor(Object.assign({
                luminosity: 'bright',
                count: count
            }, options));
        },

        render() {
            const radius = Math.min(this.calculatedWidth, this.calculatedHeight) / 2;

            const arc1 = arc()
                .outerRadius(radius)
                .innerRadius(radius / 2);

            const pie1 = pie()
                .sort(null)
                .startAngle(1.1 * Math.PI)
                .endAngle(3.1 * Math.PI)
                .value(d => d.total);

            const svg = select(this.$el)
                .append('svg')
                .attr('id', 'chart')
                .attr('width', this.calculatedWidth)
                .attr('height', this.calculatedHeight)
                .attr('viewBox', '0 0 ' + (this.calculatedWidth + Math.max(this.offset, 50)) + ' ' + (this.calculatedHeight + Math.max(this.offset, 50)))
                .attr('perserveAspectRatio', 'xMinYMid')
                .append('g')
                .attr('transform', 'translate(' + (this.calculatedWidth + Math.max(this.offset, 50)) / 2 + ',' + (this.calculatedHeight + Math.max(this.offset, 50)) / 2 + ')');

            const g = svg.selectAll('.arc')
                .data(pie1(this.formattedData))
                .enter()
                .append('g')
                .attr('class', 'arc');

            const color = scaleOrdinal().range(this.colors(size(this.formattedData)));

            let delay = 0;

            g.append('path')
                .style('fill', d => color(d.data.answer))
                .transition()
                .delay((d, i, a) => 500 - d.data.total / this.total * 500)
                .duration(d => 500 * (d.data.total / this.total))
                .attr('class', 'chart-data')
                .attrTween('d', d => {
                    const i = interpolate(d.startAngle + 0.1, d.endAngle);

                    return (t) => {
                        d.endAngle = i(t);

                        return arc1(d);
                    };
                });

            if(this.labels) {
                const arc2 = arc()
                    .outerRadius(radius + 30)
                    .innerRadius(radius);

                g.append('text')
                    .attr('transform', d => {
                        return `translate(${arc2.centroid(d)})`;
                    })
                    .attr('class', 'chart-label')
                    .style('text-anchor', 'middle')
                    .text(this.labels);
            }
        },

        resize() {
            if(!this.width) {
                this.calculatedWidth = this.$el.clientWidth;
            }

            if(!this.height) {
                this.calculatedHeight = this.$el.clientHeight || this.$el.clientWidth;
            }

            return this.resize;
        }

    }

};
</script>

<style lang="scss">
.patriotpoll-dounut-chart {

    svg {
        overflow: visible;
    }
    
    .arc {
        position: relative;
        z-index: 1;

        path {
            transition: transform .1s ease-in;
        }

        &:hover path {
            transform: scale(1.05);
        }
    }

    &.has-labels .arc path {
        stroke: white;
        stroke-width: 5px;
    }

    .chart-label {
        //opacity: 0;
        position: fixed;
        font-size: 1.5rem;
    }
}
</style>
