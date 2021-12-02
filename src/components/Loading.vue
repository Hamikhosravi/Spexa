<template>
    <div class="loading" v-if="this.$store.getters['general/isLoading']">
        <q-spinner-hourglass color="light-blue" size="4em"></q-spinner-hourglass>
        <p>Please wait for a sec ...</p>
    </div>
</template>

<script>
    export default {
        name: "Loading"
    };
</script>

<style scoped>
    .loading {
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #edededd9;
        position: absolute;
        z-index: 2001;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
</style>
