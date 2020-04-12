<template>
  <div class="app-container">
    <div id="container"></div>
    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-change="handleChange"
      :on-success="handleSuccess"
      :on-error="handleError"
      accept=".csv"
      class="dot-reader"
    >
      <el-button size="small" type="primary">批量导入点坐标</el-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      xycoords: []
    };
  },
  mounted() {
    var map = new AMap.Map("container", {
      zoom: 9, //级别
      center: [117.154169953999997, 34.1823933254] //中心点坐标
    });
    this.map = map;
  },
  methods: {
    handleChange(file, fileList) {
      let reader = new FileReader();
      reader.readAsText(file.raw);
      reader.onload = e => {
        let data = e.target.result;
        let array = this.CSVToArray(data);
        let xycoords = array.map(item => item.slice(2));
        this.xycoords = xycoords;
        let markers = xycoords.map((item, i) => {
          return new AMap.Marker({
            position: new AMap.LngLat(item[0], item[1]),
            title: `投放点${i + 1}`
          });
        });
        this.map.add(markers);
      };
    },
    CSVToArray(data, delimiter = ",", omitFirstRow = true) {
      return data
        .slice(omitFirstRow ? data.indexOf("\n") + 1 : 0)
        .split("\n")
        .map(v => v.split(delimiter));
    },
    handleSuccess() {
      this.$message.success("点坐标导入成功！");
    },
    handleError() {
      this.$message.error("点坐标导入失败！");
    }
  }
};
</script>

<style lang="scss" scoped>
#container {
  width: 1160px;
  height: 300px;
  margin-bottom: 1rem;
}
</style>
