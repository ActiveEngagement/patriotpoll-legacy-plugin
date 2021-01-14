<template>
    <share-network
        :network="network"
        :url="url"
        :title="title"
        :description="description"
        :hashtags="hashtags"
        @click.native.prevent>
        <btn type="button" size="sm" variant="social" :style="{background, color: blackOrWhite(background)}">
            <div class="btn-social-content">
                <span class="btn-social-icon" :style="{fill: blackOrWhite(background), background: darken(background, .15)}">
                    <component :is="icon" />
                </span>
                <span class="btn-social-label">
                    {{ network }}
                </span>
            </div>
        </btn>
    </share-network>
</template>

<script>
import Color from 'color';
import Btn from '@vue-interface/btn';

export default {
    components: {
        Btn
    },
    props: {
        url: {
            type: String,
            required: true
        },
        network: {
            type: String,
            required: true
        },
        background: String,
        icon: Object,
        title: String,
        description: String,
        hashtags: String
    },
    methods: {
        blackOrWhite(value) {
            return Color(value) ? 'white' : 'black';
        },
        darken(value, amount) {
            return Color(value).darken(amount);
        }
    }
};
</script>

<style>
.btn-social {
    position: relative;
}
.btn-social-icon {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    display: flex;
    width: 2.5em;
    align-items: center;
    justify-content: center;
}
.btn-social-icon svg {
    width: 65%;
    height: 65%;
}
.btn-social-content {
    display: flex;
    align-items: center;
    padding-left: 2.25em;
}

.btn-social-label {
    font-size: .75em;
}

@media(min-width:768px) {
    .btn-social-label {
        font-size: .95em;
    }
}
</style>