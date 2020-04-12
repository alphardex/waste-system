<template>
  <div class="app-container">
    <div id="container"></div>
    <div class="filter-container">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :on-error="handleError"
        :show-file-list="false"
        accept=".csv,.txt"
        class="dot-reader"
      >
        <el-button type="primary">批量导入点坐标</el-button>
      </el-upload>
      <el-button type="primary" @click="handleClear" class="clear"
        >清空点坐标</el-button
      >
    </div>
    <div class="weight-range-control">
      <span>垃圾点重量范围</span
      ><el-slider
        v-model="weightRange"
        range
        @change="handleFilter"
      ></el-slider>
    </div>
    <div class="vehicle-control">
      <span class="form-control-label">车辆行驶速度(公里/小时)</span>
      <el-input-number
        v-model="vehicleSpeed"
        :min="0"
        :max="120"
      ></el-input-number>
      <span class="form-control-label">车辆最大载重(吨)</span>
      <el-input-number
        v-model="vehicleCapacity"
        :min="0"
        :max="20"
      ></el-input-number>
    </div>
    <el-table
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      :data="cachedPoints"
      border
      height="250"
    >
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="X" prop="x"></el-table-column
      ><el-table-column label="Y" prop="y"></el-table-column>
      <el-table-column label="重量(吨)" prop="weight"></el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{ row, $index }">
          <el-button
            size="mini"
            type="primary"
            @click="handleUpdate(row)"
            icon="el-icon-edit"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
            icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改点信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="X" label-width="120px" prop="x">
          <el-input v-model="form.x" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Y" label-width="120px" prop="y">
          <el-input v-model="form.y" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="重量(吨)" label-width="120px" prop="weight">
          <el-input v-model="form.weight" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      points: [],
      cachedPoints: [],
      listLoading: false,
      weightRange: [0, 100],
      vehicleSpeed: 40,
      vehicleCapacity: 8,
      dialogFormVisible: false,
      form: {
        id: null,
        x: "",
        y: "",
        weight: ""
      },
      rules: {
        x: [{ required: true, message: "请输入x坐标", trigger: "blur" }],
        y: [{ required: true, message: "请输入y坐标", trigger: "blur" }],
        weight: [{ required: true, message: "请输入重量", trigger: "blur" }]
      }
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
        let points = xycoords.map((item, i) => ({
          id: i + 1,
          x: item[0],
          y: item[1],
          weight: (Math.random() * 100).toFixed(1)
        }));
        this.points = points;
        this.cachedPoints = [...points];
        this.updateMap(points);
      };
    },
    CSVToArray(data, delimiter = ",", omitFirstRow = true) {
      return data
        .slice(omitFirstRow ? data.indexOf("\n") + 1 : 0)
        .split("\n")
        .map(v => v.split(delimiter));
    },
    setMarkers(points) {
      return points.map((item, i) => {
        return new AMap.Marker({
          position: new AMap.LngLat(item.x, item.y),
          title: `投放点${i + 1}\n重量: ${item.weight}吨`
        });
      });
    },
    handleSuccess() {
      this.$message.success("点坐标导入成功！");
    },
    handleError() {
      this.$message.error("点坐标导入失败！");
    },
    handleFilter() {
      this.cachedPoints = [...this.points].filter(
        item =>
          item.weight >= this.weightRange[0] &&
          item.weight <= this.weightRange[1]
      );
      this.updateMap(this.cachedPoints);
    },
    handleClear() {
      this.map.clearMap();
      this.points = [];
      this.cachedPoints = [];
      this.$message.success("点坐标已清空！");
    },
    updateMap(points) {
      this.map.clearMap();
      let markers = this.setMarkers(points);
      this.map.add(markers);
    },
    handleUpdate(row) {
      this.form = { ...row };
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          const index = this.points.findIndex(item => item.id === this.form.id);
          this.points.splice(index, 1, this.form);
          this.cachedPoints = [...this.points];
          this.updateMap(this.cachedPoints);
          this.dialogFormVisible = false;
          this.$message.success("修改成功！");
        }
      });
    },
    handleDelete(row, index) {
      this.$message.success("删除成功！");
      this.points.splice(index, 1);
      this.cachedPoints = [...this.points];
      this.updateMap(this.cachedPoints);
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

.clear {
  margin-left: 10px;
}

.vehicle-control {
  margin-bottom: 10px;
}

.form-control-label {
  margin-right: 10px;
}
</style>
