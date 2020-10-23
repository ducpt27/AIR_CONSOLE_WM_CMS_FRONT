<template>
  <div class="notification is-danger bg-danger">
    {{ message }}
  </div>
</template>

<style>
.notification {
  padding: 11px;
  margin: 10px 0;
  color: red;
}
</style>

<script>
export default {
  name: 'Notification',
  // eslint-disable-next-line vue/require-prop-types
  props: ['message'],
}
</script>
