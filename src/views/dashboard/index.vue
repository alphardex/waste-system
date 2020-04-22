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
      <ul class="icon-block-list">
        <IconBlock icon="trash" name="垃圾吨数" :desc="trashWeight + ' 吨'" type="warning" />
        <IconBlock icon="marker" name="投放点数" :desc="disposalCount + ' 个'" type="success" />
        <IconBlock icon="trash" name="垃圾车数" :desc="vehicleCount + ' 辆'" type="danger" />
        <IconBlock icon="driver" name="驾驶员数" :desc="driverCount + ' 位'" type="primary" />
        <IconBlock icon="user" name="总用户数" :desc="userCount + ' 位'" type="info" />
        <IconBlock icon="task" name="总任务数" :desc="taskCount + ' 个'" type="warning" />
        <IconBlock icon="clock" name="运行天数" :desc="runningDay + ' 天'" type="primary" />
      </ul>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import IconBlock from '@/components/IconBlock'

export default {
  name: 'Dashboard',
  components: { IconBlock },
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

.icon-block-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 30px;
  padding: 0;
  margin: 0;
  list-style-type: none;
}
</style>
