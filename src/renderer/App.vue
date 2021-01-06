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
  .close {
    position: absolute;
    right: 8px;
    top: 6px;
    z-index: 42;
    background-color: antiquewhite;
    font-size: 30px;
    height: 30px;
    width: 30px;
    color: red;
    padding: 4px 0 11px 15px;
    border: 1px solid red;
    cursor: pointer;
  }
  .definitions, .bookmark, .settings {
    position: absolute;
    padding: 2em;
    border: 1px solid lightgray;
    background-color: antiquewhite;
    width: 100%;
    box-sizing: border-box;
  }
  button {
    background-color: #66aa66;
    outline: 0;
    border: 0;
    color: white;
    font-weight: 600;
    padding: 0.6em 1em;
    cursor: pointer;  
  }
  select {
    background-color: white;
    padding: 7px;
    color: gray;    
  }

</style>
