<template>
  <div class="dashboard-container">
    <header class="welcome-banner">
      <h2>你好，{{ name }}！</h2>
      <p>欢迎来到徐州市垃圾收运系统</p>
    </header>
    <section class="section">
      <div class="section-titles">
        <div class="section-title">统计数据</div>
      </div>
      <ul class="statistics-list">
        <li class="statistics-list__item active" style="--statistics-color: var(--warning-color-darker);">
          <div class="statistics-icon">
            <svg-icon icon-class="trash" />
          </div>
          <div class="statistics-name">垃圾吨数</div>
          <div class="statistics-size">{{ trashWeight }} 吨</div>
        </li>
        <li class="statistics-list__item active" style="--statistics-color: var(--success-color-darker);">
          <div class="statistics-icon">
            <svg-icon icon-class="marker" />
          </div>
          <div class="statistics-name">投放点数</div>
          <div class="statistics-size">{{ disposalCount }} 个</div>
        </li>
        <li class="statistics-list__item" style="--statistics-color: var(--danger-color-darker);">
          <div class="statistics-icon">
            <svg-icon icon-class="truck" />
          </div>
          <div class="statistics-name">垃圾车数</div>
          <div class="statistics-size">{{ vehicleCount }} 辆</div>
        </li>
        <li class="statistics-list__item" style="--statistics-color: var(--primary-color-darker);">
          <div class="statistics-icon">
            <svg-icon icon-class="driver" />
          </div>
          <div class="statistics-name">驾驶员数</div>
          <div class="statistics-size">{{ driverCount }} 位</div>
        </li>
        <li class="statistics-list__item" style="--statistics-color: var(--info-color-darker);">
          <div class="statistics-icon">
            <svg-icon icon-class="user" />
          </div>
          <div class="statistics-name">总用户数</div>
          <div class="statistics-size">{{ userCount }} 位</div>
        </li>
        <li class="statistics-list__item active" style="--statistics-color: var(--warning-color-darker);">
          <div class="statistics-icon">
            <svg-icon icon-class="task" />
          </div>
          <div class="statistics-name">总任务数</div>
          <div class="statistics-size">{{ taskCount }} 个</div>
        </li>
        <li class="statistics-list__item" style="--statistics-color: var(--primary-color-darker);">
          <div class="statistics-icon">
            <svg-icon icon-class="clock" />
          </div>
          <div class="statistics-name">运行时长</div>
          <div class="statistics-size">{{ runningDay }} 天</div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      trashWeight: 666,
      disposalCount: 10000,
      vehicleCount: 500,
      driverCount: 1000,
      userCount: 1200,
      taskCount: 20,
      runningDay: 1
    }
  },
  computed: {
    ...mapGetters(['name'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 30px;
}

.welcome-banner {
  padding: 18px 36px;
  color: white;
  background: var(--warning-color);
  border-radius: 20px;
}

.section-titles {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 28px 0;
}

.section-title {
  display: grid;
  grid-template-columns: repeat(2, auto);
  align-items: center;
  font-size: 18px;
}

.statistics-list {
  display: grid;
  grid-template-columns: repeat(7, auto);
  gap: 30px;
  padding: 0;
  margin: 0;
  list-style-type: none;

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 18px 24px;
    border: 1px solid var(--secondary-color-lighter);
    border-radius: 20px;

    .statistics-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      border: 1px solid var(--statistics-color);
      border-radius: 10px;

      svg {
        fill: var(--statistics-color);
      }
    }

    .statistics-name {
      margin-top: 18px;
      white-space: nowrap;
    }

    .statistics-size {
      margin-top: 9px;
      font-size: 18px;
      font-weight: bold;
      white-space: nowrap;
    }
  }
}
</style>
