<template>
    <div class="animate-clock">
        <div class="top" />
        <div class="right" />
        <div class="bottom" />
        <div class="left" />
        <div class="center" />
        <div class="shadow" />
        <div class="hour" />
        <div class="minute" />
        <div class="second" />
    </div>
</template>

<style lang="scss">
.animate-clock {
    position: relative;
    height: 200px;
    width: 200px;
    background: white;
    box-sizing: border-box;
    border-radius: 100%;
    border: 10px solid #000;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    overflow: hidden;

    .top {
        position: absolute;
        width: 3px;
        height: 8px;
        background: #262626;
        left: 0;
        right: 0;
        margin: 0 auto;
    }

    .right {
        position: absolute;
        width: 8px;
        height: 3px;
        background: #262626;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto 0;
    }

    .bottom {
        position: absolute;
        width: 3px;
        height: 8px;
        background: #262626;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0 auto;
    }

    .left {
        position: absolute;
        width: 8px;
        height: 3px;
        background: #262626;
        top: 0;
        bottom: 0;
        left: 0;
        margin: auto 0;
    }

    .center {
        height: 6px;
        width: 6px;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        background: #262626;
        border-radius: 100%;
    }

    .shadow {
        height: 200px;
        width: 200px;
        position: absolute;
        left: 60px;
        top: 60px;
        transform: rotate(135deg);
        background: linear-gradient(transparent, rgba(#000, 0.1));
    }

    .hour {
        width: 3px;
        height: 100%;
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        animation: time 10s infinite linear;

        &:before {
            position: absolute;
            content: "";
            background: #262626;
            height: 60px;
            width: 3px;
            top: 30px;
        }
    }

    .minute {
        width: 1px;
        height: 100%;
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        animation: time 3s infinite linear;

        &:before {
            position: absolute;
            content: "";
            background: #262626;
            height: 40px;
            width: 1px;
            top: 50px;
        }
    }
    
    .second {
        width: 2px;
        height: 100%;
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        animation: time 1.25s infinite linear;

        &:before {
            position: absolute;
            content: "";
            background: #fd1111;
            height: 45px;
            width: 2px;
            top: 45px;
        }
    }
}

@keyframes time {
  to {
    transform: rotate(360deg);
  }
}
</style>