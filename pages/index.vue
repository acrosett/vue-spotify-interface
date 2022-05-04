<template>
  <div>
    <h1>Hello world!</h1>
    <button v-on:click="logToken">Log Access Token</button>
  </div>
</template>

<script>
export default {
  methods: {
    logToken() {
      this.$spotifyService.logAuthToken();
    },
  },
  mounted() {},
  data() {
    return {
      token: null,
    };
  },
};
</script>