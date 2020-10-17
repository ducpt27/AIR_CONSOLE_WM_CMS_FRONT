<template>
  <h1>Your question {{ $route.params.id }} is active</h1>
</template>

<script>
export default {
  validate({ params, store }) {
    return true
  },
}
</script>
