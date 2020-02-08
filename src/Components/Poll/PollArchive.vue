<template>
    <section class="poll-archive my-lg-5 py-lg-5">
        <activity-indicator v-if="activity" label="Loading Archive..." type="spinner" min-height="200px" />

        <div v-else-if="!!polls.length" class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    <h2 class="section-heading text-uppercase">
                        Poll Archive
                    </h2>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="card-columns">
                        <transition-group name="fade">
                            <poll-card v-for="poll in polls" :key="poll.id" :poll="poll" />
                        </transition-group>
                    </div>
                </div>
            </div>

            <div v-if="loadMore" class="row">
                <div class="col-sm-12 load-more">
                    <btn-activity :activity="activity" indicator="dots" size="md" @click="load(page + 1)">
                        Load More
                    </btn-activity>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import PollCard from './PollCard';
import axios from '../../Helpers/axios';
import BtnActivity from 'vue-interface/src/Components/BtnActivity';
import ActivityIndicator from 'vue-interface/src/Components/ActivityIndicator';

export default {

    name: 'PollArchive',

    components: {
        PollCard,
        BtnActivity,
        ActivityIndicator
    },
	
    props: {
        apiKey: {
            type: String,
            required: true
        }
    },

    data() {
        return {
            page: 1,
            polls: [],
            activity: true,
            loadMore: false
        };
    },

    mounted() {
        if(!this.polls.length) {
            this.load(this.page);
        }
    },

    methods: {

        load(page) {
            this.activity = true;
			
            return axios.get('polls', {
                params: {
                    limit: 9,
                    expired: 1,
                    page: page
                },
                headers: {
                    Authorization: 'Bearer ' + this.apiKey
                }
            })
                .then(({ data }) => {
                    this.polls = data.data;
                    this.page = data.current_page;
                    this.loadMore = data.current_page < data.last_page;
                }, e => {
                    console.log(e);
                })
                .finally(() => {
                    this.activity = false;
                });
        }

    }

};
</script>

<style lang="scss">
@import '../../assets/scss/mixins';
@import '../../assets/scss/variables';
@import '~bootstrap/scss/_functions.scss';
@import '~bootstrap/scss/_variables.scss';

.poll-archive {
    position: relative;

    // Styling for the pollarchive section

	.section-heading {
		color: $primary-blue;
	}

	.card {
		border-radius: 0;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.04), 0 6px 20px 0 rgba(0, 0, 0, 0.04);
    	border-color: rgba(0, 0, 0, 0.05);
		margin: 15px;
		padding: 15px;

		.card-header, .card-footer {
			border: none;
			background-color: white;
		}

		.poll-img {
			margin-bottom: 15px;
		}

		.card-header {
			@include body-font;
			background-color: transparent;
			padding: none;
			padding-bottom: 0px;
			color: $primary-red;
			font-size: 12px;
			text-transform: uppercase;
			text-align: right;
			font-weight: 700;
			letter-spacing: 1px;
		}

		.card-title {
			@include body-font;
		}

		.card-footer {
			margin: 0px auto;
			text-align: center;
			padding: 0px 2px 5px 10px;
		}

		.progress {
			margin-bottom: 10px;
			height: 2.5rem;
			border-radius: 0;
			overflow: scroll;
			background-color: #f6f6f6;

            span {
                padding-left: .5rem;
            }

            &.text-dark span {
                color: $dark;
            }

			.progress-bar {
				text-align: left;
				background-color: $primary-red;
				color: white;
				font-size: 1rem;
				font-weight: 500;
			}
		}
	}

	.icon {
		i {
			font-size: 20px;
			left: 9px;
			top: 10px;
			color: $primary-blue;
		}

		&.social {
			float: right;
			margin: 0 5px 8px 0;
			cursor: pointer;
			color: $primary-blue;
			transition: 0.25s;
			-moz-transition: 0.25s;
			-webkit-transition: 0.25s;
			-o-transition: 0.25s;
			margin-right: 15px;
		}
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
