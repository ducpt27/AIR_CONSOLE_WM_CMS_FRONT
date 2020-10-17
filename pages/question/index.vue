<template>
  <div>
    <h1>Question page welcome!</h1>
    <label>
      <input
        v-model="questionID"
        type="text"
        placeholder="Please enter questionID"
      />
    </label>
    <button @click="showQuestion">Go to question</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questionID: '',
    }
  },
  methods: {
    showQuestion() {
      this.$router.push(`/question/${this.questionID}`)
    },
  },
}
</script>
