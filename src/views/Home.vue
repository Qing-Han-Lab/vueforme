<style scoped lang='scss'>
.home{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f7f7f7;
  .home-title{
    width: 100%;
    height: 100px;
    background: yellow;
  }
}
</style>

<template>
<div class='home'>
  <div class="home-title"></div>
</div>
</template>

<script>
export default {
  data(){
    return{
      text : 1
    }
  }
};
</script>