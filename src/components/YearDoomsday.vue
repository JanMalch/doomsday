<template>
  <Formula
    :formula="'({\\lfloor}\\frac{yy}{12}{\\rfloor} + yy \\mod 12 + {\\lfloor}\\frac{yy \\mod 12}{4}{\\rfloor} + cd) \\mod 7'"
  ></Formula>
  <Formula
    :formula="
      '= ({\\lfloor}\\frac{' +
      yy +
      '}{12}{\\rfloor} + ' +
      yy +
      ' \\mod 12 + {\\lfloor}\\frac{' +
      yy +
      ' \\mod 12}{4}{\\rfloor} + ' +
      cd +
      ') \\mod 7'
    "
  ></Formula>
  <Formula
    :formula="
      '= (' +
      floor(yy / 12) +
      ' + ' +
      (yy % 12) +
      ' + ' +
      floor((yy % 12) / 4) +
      ' + ' +
      cd +
      ') \\mod 7'
    "
  ></Formula>
  <Formula
    :formula="
      '= ' +
      (floor(yy / 12) + (yy % 12) + floor((yy % 12) / 4) + cd) +
      ' \\mod 7'
    "
  ></Formula>
  <Formula
    :formula="
      '= ' + ((floor(yy / 12) + (yy % 12) + floor((yy % 12) / 4) + cd) % 7)
    "
  ></Formula>
</template>

<script lang="ts">
import Formula from "@/components/Formula.vue";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    yy: Number,
    cd: Number,
  },
  components: {
    Formula,
  },
})
export default class YearDoomsday extends Vue {
  yy!: number;
  cd!: number;

  floor(value: number): number {
    return Math.floor(value);
  }
}
</script>

<style scoped lang="scss"></style>
