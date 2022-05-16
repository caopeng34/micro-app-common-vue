<template>
  <div class="hello">
    <button @click="reqapi">http</button>
    <h1>{{ msg }}</h1>
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    reqapi() {
      this.$http.get({url: "/api/hello"}).then(res => {
        console.log(res)
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
