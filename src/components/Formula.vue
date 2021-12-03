<template>
  <div
    v-if="!inline"
    class="formula-container"
    ref="container"
    :data-tex-formula="formula"
  ></div>
  <span
    v-else
    class="formula-container"
    ref="container"
    :data-tex-formula="formula"
  >
  </span>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch, onMounted } from "vue";
import katex from "katex";

export default defineComponent({
  name: "Formula",
  props: {
    formula: {
      type: String,
      required: true,
    },
    inline: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const state: { container: HTMLElement | null } = reactive({
      container: null,
    });

    const renderFormula = () => {
      if (state.container != null) {
        katex.render(props.formula, state.container, {
          throwOnError: false,
        });
      }
    };

    watch(
      () => props.formula,
      () => {
        renderFormula();
      }
    );

    onMounted(() => {
      renderFormula();
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style scoped lang="scss">
div.formula-container {
  text-align: center;
  margin: 8px 0;
  overflow: auto hidden;
}

span.formula-container {
  font-size: 16px;
}
</style>
