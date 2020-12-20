<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'online-reader'
  }
</script>

<style>
  #app {
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-family: Arial, Helvetica, sans-serif;
  }
</style>
