<template>
    <section class="poll-archive container">
        <activity-indicator v-if="!loaded" type="pulse" center min-height="200" />

        <div v-else-if="!!polls.length">
            <div class="row">
                <div class="col-lg-12 text-center">
                    <h2 class="section-heading text-uppercase">
                        Poll Archive
                    </h2>
                </div>
            </div>
            <div class="poll-cards">
                <poll-card
                    v-for="poll in polls"
                    :key="poll.id"
                    :poll="poll"
                    :permalink="permalink"
                    :hide-content="hideContent"
                    :hide-date="hideDate"
                    :hide-image="hideImage"
                    :hide-question="hideQuestion"
                    :hide-statistics="hideStatistics" />
            </div>

            <div v-if="loadMore" class="row">
                <div class="col-sm-12 load-more">
                    <btn-activity
                        :activity="activity"
                        indicator="dots"
                        size="md"
                        @click="load(page + 1)">
                        Load More
                    </btn-activity>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { ActivityIndicator, register, Dots, Pulse } from '@vue-interface/activity-indicator';
import BtnActivity from '@vue-interface/btn-activity';
import Permalink from '../../Mixins/Permalink';
import PollCard from './PollCard';

register({
    dots: Dots,
    pulse: Pulse
});

import Poll from './Poll';

export default {

    name: 'PollArchive',

    components: {
        ActivityIndicator,
        BtnActivity,
        PollCard,
    },

    mixins: [
        Permalink
    ],
    
    props: {

        hideContent: {
            type: Boolean,
            default: false
        },

        hideImage: {
            type: Boolean,
            default: false
        },

        hideStatistics: {
            type: Boolean,
            default: false
        },

        hideQuestion: {
            type: Boolean,
            default: false
        },

        hideDate: {
            type: Boolean,
            default: false
        }

    },
    
    data() {
        return {
            page: 1,
            polls: [],
            loaded: false,
            activity: true,
            loadMore: false,
            exception: null,
        };
    },

    mounted() {
        if(!this.polls.length) {
            this.load(this.page).then(() => this.loaded = true);
        }
    },

    methods: {

        load(page) {
            this.activity = true;
            
            return this.$patriotpoll.get('polls', {
                params: {
                    limit: 9,
                    expired: 1,
                    page: page
                }
            })
                .then(({ data }) => {
                    this.activity = false;
                    this.polls = this.polls.concat(data.data);
                    this.page = data.current_page;
                    this.loadMore = data.current_page < data.last_page;
                }, e => {
                    this.activity = false;
                    this.exception = e;
                });
        }

    }

};
</script>

<style lang="scss">
@import '../../assets/scss/mixins';
@import '../../assets/scss/variables';

.poll-archive {
    position: relative;

	.section-heading {
		color: $primary-blue;
    }
    
    .poll-card {
        margin-bottom: 1rem;
    }

    @media(min-width:768px) {
        .poll-cards {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-gap: 1em;
        }

        .poll-card {
            margin-bottom: 0;
        }
    }

	.poll-card .card-body {
		border-radius: 0;
		border-color: rgba(0, 0, 0, 0.05);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.04), 0 6px 20px 0 rgba(0, 0, 0, 0.04);
        flex-grow: 0;
    }

    .load-more {
		text-align: center;

		.btn {
			@include body-font;
			padding: 20px 40px 20px 40px;
			border-radius: 50px;
			background-color: $primary-red;
			border: none;
			text-transform: uppercase;
			font-weight: 700;
			letter-spacing: 1px;
			margin-top: 40px;
			box-shadow: inset 2px -4px darken($primary-red, 10%);

			&:hover {
				background-color: darken($primary-red, 10%) !important;
			}

			&:active {
				background-color: darken($primary-red, 10%) !important;
			}

            &.btn-activity {
                padding-right: 5rem;

                .activity-indicator {
                    margin-right: 1rem;
                }
            }
		}
	}
}
</style>
