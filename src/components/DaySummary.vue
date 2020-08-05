<template>
  <header class="hero is-primary is-bold">
  <!-- <div class="container is-fluid"> -->
    <div class="hero-body">
      <h1 class="title is-2"> {{ msg }} </h1>
      <h2 class="subtitle is-4"> {{ dateTimeFormat.format(new Date()) }} </h2>
    </div>
  <!-- </div> -->
  </header>
</template>

<script>
export default {
  name: 'DaySummary',
  props: {
    msg: String
  },
  created: function () {
    this.dateTimeFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
