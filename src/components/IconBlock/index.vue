<template>
  <div class="icon-block" :style="iconBlockColor">
    <div class="icon-block__icon">
      <svg-icon :icon-class="icon" />
    </div>
    <div class="icon-block__name">{{ name }}</div>
    <div class="icon-block__desc">{{ desc }}</div>
  </div>
</template>

<script>
export default {
  name: 'IconBlock',
  props: {
    icon: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    iconBlockColor() {
      return `--icon-block-color: var(--${this.type}-color-darker);`
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 18px 24px;
  border: 1px solid var(--secondary-color-lighter);
  border-radius: 20px;

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--icon-block-color);
    border-radius: 10px;

    svg {
      fill: var(--icon-block-color);
    }
  }

  &__name {
    margin-top: 18px;
    white-space: nowrap;
  }

  &__desc {
    margin-top: 9px;
    font-size: 18px;
    font-weight: bold;
    white-space: nowrap;
  }
}
</style>
