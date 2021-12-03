<template>
  <Formula
    :formula="'cd = Tuesday - ({\\lfloor}\\frac{{yyyy}}{100}{\\rfloor} \\mod 4) * 2'"
  ></Formula>
  <Formula
    :formula="
      '= Tuesday - ({\\lfloor}\\frac{{' +
      yyyy +
      '}}{100}{\\rfloor} \\mod 4) * 2'
    "
  ></Formula>
  <Formula
    :formula="'= 2 - (' + floor(this.yyyy / 100) + ' \\mod 4) * 2'"
  ></Formula>
  <Formula
    :formula="'= 2 - ' + (floor(this.yyyy / 100) % 4) + ' * 2'"
  ></Formula>
  <Formula :formula="'= 2 - ' + (floor(this.yyyy / 100) % 4) * 2"></Formula>
  <Formula :formula="'= ' + (2 - (floor(this.yyyy / 100) % 4) * 2)"></Formula>
</template>

<script lang="ts">
import Formula from "@/components/Formula.vue";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    yyyy: Number,
  },
  components: {
    Formula,
  },
})
export default class CenturyDoomsday extends Vue {
  yyyy!: number;

  floor(value: number): number {
    return Math.floor(value);
  }
}
</script>

<style scoped lang="scss"></style>
