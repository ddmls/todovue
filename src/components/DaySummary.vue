<template>
  <!-- <header class="hero is-primary is-bold"> -->
  <header class="hero">
  <!-- <div class="container is-fluid"> -->
    <div class="hero-body">
      <h1 class="title is-2 is-family-secondary has-text-light"> {{ msg }} </h1>
      <h2 class="subtitle is-4 has-text-light"> {{ dateTimeFormat.format(new Date()) }} </h2>
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
.title {
  letter-spacing: .2rem;
  animation-name: spaceout-fadein;
  animation-duration: 2s;
  animation-timing-function: ease;
  // animation: 2s ease-out spaceout;
}

.subtitle {
    animation-name: delayed-fadein;
    animation-duration: 2s;
    // animation-delay: 1s;
    animation-timing-function: ease;
}

// TODO: must make sure image has been loaded
// e.g. event "load"

@keyframes spaceout-fadein {
  from {
    letter-spacing: inherit;
    opacity: 0;
    margin-left: 10px;
  }

  to {
    // letter-spacing: .2rem;
    // opacity: 1;
  }
}

@keyframes delayed-fadein {
  from {
    opacity: 0;
    margin-left: -5px;
  }

  50% {
    opacity: 0;
    margin-left: -5px;
  }

  to {
    opacity: 1;
  }
}

header {
  background-image: url('../assets/DSC_0195_v1.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  // filter: blur(8px);
}
</style>
