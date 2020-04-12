<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="姓名"
        clearable
        @input="handleFilter"
      ></el-input>
      <el-select
        v-model="listQuery.gender"
        placeholder="性别"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in genderOptions"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <el-select v-model="listQuery.sort" @change="handleFilter">
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :value="item.key"
          :label="item.label"
        ></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" @click="handleCreate"
        >添加</el-button
      >
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="拼命加载中"
      border
      style="whitespace: nowrap;"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        :class-name="getSortClass('id')"
      >
      </el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="性别" prop="gender"></el-table-column>
      <el-table-column label="出生日期" prop="birthdate">
        <template slot-scope="{ row }">
          <span>{{ row.birthdate | parseTime("{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" prop="phone"></el-table-column>
      <el-table-column label="工作年份" prop="worktime"></el-table-column>
      <el-table-column label="驾驶证" prop="license"></el-table-column>
      <el-table-column label="车牌号" prop="platenumber"></el-table-column>
      <el-table-column label="违章次数" prop="violation"></el-table-column>
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
    <Pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    ></Pagination>
    <el-dialog
      :title="dialogStatus === 'create' ? '添加驾驶员信息' : '修改驾驶员信息'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="姓名" label-width="120px" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="120px" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期" label-width="120px" prop="birthdate">
          <el-date-picker v-model="form.birthdate"></el-date-picker>
        </el-form-item>
        <el-form-item label="电话" label-width="120px" prop="phone">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工作年份" label-width="120px" prop="worktime">
          <el-date-picker v-model="form.worktime" type="year"></el-date-picker>
        </el-form-item>
        <el-form-item label="驾驶证" label-width="120px" prop="license">
          <el-select v-model="form.license">
            <el-option
              v-for="item in licenseOptions"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" label-width="120px" prop="platenumber">
          <el-input v-model="form.platenumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="违章次数" label-width="120px">
          <el-input v-model="form.violation" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createDriver, updateDriver } from "@/api/drivers";
import Pagination from "@/components/Pagination";
import { updateVehicle } from "../../api/vehicles";
import { parseTime } from "@/utils";

export default {
  name: "DriversTable",
  components: { Pagination },
  filters: { parseTime },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined,
        sort: "+id"
      },
      total: 0,
      genderOptions: ["男", "女"],
      sortOptions: [
        { label: "升序", key: "+id" },
        { label: "降序", key: "-id" }
      ],
      dialogFormVisible: false,
      dialogStatus: "",
      form: {
        id: null,
        name: "",
        gender: "",
        birthdate: "",
        phone: "",
        worktime: "",
        license: "",
        violation: "",
        platenumber: ""
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
        birthdate: [
          { required: true, message: "请选择出生日期", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/,
            message: "电话号码格式不对",
            trigger: "blur"
          }
        ],
        worktime: [
          { required: true, message: "请选择工作年份", trigger: "blur" }
        ],
        license: [
          { required: true, message: "请选择驾驶证类型", trigger: "blur" }
        ],
        platenumber: [
          { required: true, message: "请输入车牌号", trigger: "blur" },
          {
            pattern: /^(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(?:(?:[0-9]{5}[DF])|(?:[DF](?:[A-HJ-NP-Z0-9])[0-9]{4})))|(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/,
            message: "车牌号格式不对",
            trigger: "blur"
          }
        ]
      },
      licenseOptions: ["A", "B", "C", "D", "E"]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      this.listQuery.sort = order === "ascending" ? "+id" : "-id";
      this.handleFilter();
    },
    getSortClass(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
    handleCreate() {
      this.resetForm();
      this.dialogFormVisible = true;
      this.dialogStatus = "create";
      this.$nextTick(() => {
        this.$refs["ruleForm"].clearValidate();
      });
    },
    resetForm() {
      this.form = {
        id: null,
        name: "",
        gender: "",
        birthdate: "",
        phone: "",
        worktime: "",
        license: "",
        violation: "",
        platenumber: ""
      };
    },
    createData() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.form.id = parseInt(Math.random() * 100) + 1024;
          createDriver(this.form).then(() => {
            this.list.unshift(this.form);
            this.dialogFormVisible = false;
            this.$message.success("创建成功！");
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$message.success("删除成功！");
      this.list.splice(index, 1);
    },
    handleUpdate(row) {
      this.form = { ...row };
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          updateVehicle(this.form).then(() => {
            const index = this.list.findIndex(item => item.id === this.form.id);
            this.list.splice(index, 1, this.form);
            this.dialogFormVisible = false;
            this.$message.success("修改成功！");
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-container {
  & > * {
    margin-right: 6px;
  }
}

.el-input {
  width: 200px;
}

.el-select {
  width: 90px;
}
</style>
