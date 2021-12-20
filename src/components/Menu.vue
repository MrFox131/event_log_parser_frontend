<template>
  <div id="nav">
    <router-link to="/">Главная</router-link> |
    <router-link to="/load-file">Загрузить файл</router-link>
  </div>
</template>

<script>
export default {
  name: "Menu"
}
</script>

<style scoped lang="scss">
#nav {
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  padding: 30px;
  position: sticky;
  top:0;
  justify-content: center;
  a {
    font-weight: bold;
    color: rgba(42, 59, 77, 0.98);
    padding-left: 10px;
    padding-right: 10px;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
