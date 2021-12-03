<template>
  <header>
    <h1>the&nbsp;&nbsp;<span>doomsday</span>&nbsp;&nbsp;rule</h1>
    <p>
      A mathematical party-trick to
      <strong>calculate the weekday for (almost) any given date.</strong>
      <br />
      This app just demonstrates the step by step calculations and provides a
      practice mode.
      <br />
      Please refer to the
      <a
        class="external-link"
        href="https://en.wikipedia.org/wiki/Doomsday_rule"
        target="_blank"
        rel="noopener"
      >
        <span>Wikipedia article</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
      for an in-depth description of the method and variations.
    </p>
  </header>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class Welcome extends Vue {}
</script>

<style scoped lang="scss">
h1 {
  display: inline-block;
  margin: 0 auto;
  font-size: 2.5em;
  font-weight: 300;
  position: relative;

  > span {
    font-size: 2em;
    letter-spacing: 1px;
  }

  &::after {
    content: "";
    position: absolute;
    left: -0.5em;
    right: -0.5em;
    bottom: 0.23em;
    height: 1px;
    background-color: currentColor;
  }
}

@media only screen and (max-width: 599px) {
  h1 {
    font-size: 1.5em;
  }

  header {
    padding: 0 1em;
  }
}
</style>
