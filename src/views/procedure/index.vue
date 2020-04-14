<template>
  <div class="app-container">
    <el-steps :active="4">
      <el-step title="垃圾收集" description="人们将垃圾从产生源投放至垃圾桶的过程" />
      <el-step title="垃圾运输" description="垃圾车遵循一定路线收集所有投放点的垃圾" />
      <el-step title="垃圾转运" description="将压缩后的垃圾运往处理厂" />
      <el-step title="垃圾处理" description="将垃圾进行处理" />
    </el-steps>
    <el-alert
      title="本系统主要解决的是“垃圾运输”这一步"
      type="info"
      description="通过一定的算法，规划出垃圾车的最佳运输路线，以提高垃圾收运的经济效益"
      show-icon
      :closable="false"
    />
  </div>
</template>
