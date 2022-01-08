<template>
  <div class="hello">
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    msg: String,
  }
})
export default class HelloWorld extends Vue {
  msg!: string;
}
</script>

<style scoped lang="scss">
</style>
