<template>
  <div class="switch-panel" :style="switchPanelColor">
    <div class="switch-panel__header">
      <div class="switch-panel__icon">
        <svg-icon :icon-class="icon" />
      </div>
      <div class="switch-panel__menu">
        <svg-icon icon-class="menu" />
      </div>
    </div>
    <div class="switch-panel__content">
      <div class="switch-panel__name">{{ name }}</div>
      <div class="switch-panel__switch">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SwitchPanel',
  props: {
    icon: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    switchPanelColor() {
      return `--switch-panel-color: var(--${this.type}-color);`
    }
  }
}
</script>

<style lang="scss" scoped>
.switch-panel {
  padding: 4px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: 0.3s;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px;
    color: white;
    background: var(--switch-panel-color);
    border-radius: 15px;
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }

  &__content {
    display: flex;
    justify-content: space-between;
    padding: 30px 16px 21px 16px;
  }

  &__name {
    margin-right: 22px;
    white-space: nowrap;
  }
}
</style>
