<template>
    <div>
        <router-view />
    </div>
</template>

<style lang="scss">
@import 'bootstrap/scss/bootstrap.scss';

/* Style.css overrides */
.text-truncate {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
}
</style>