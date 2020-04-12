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
      <el-button type="primary" icon="el-icon-edit" @click="handleCreate"
        >新建</el-button
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
      <el-table-column label="出生日期" prop="birthdate"></el-table-column>
      <el-table-column label="电话" prop="phone"></el-table-column>
      <el-table-column label="工作时间" prop="worktime"></el-table-column>
      <el-table-column label="驾驶证" prop="license"></el-table-column>
      <el-table-column label="违章次数" prop="violation"></el-table-column>
      <el-table-column label="车牌号" prop="platenumber"></el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="{ row, $index }">
          <el-button size="mini" type="primary" @click="handleUpdate(row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
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
    <el-dialog title="新建驾驶员" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="姓名" label-width="120px">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="120px">
          <el-input v-model="form.gender" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" label-width="120px">
          <el-input v-model="form.birthdate" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工作时间" label-width="120px">
          <el-input v-model="form.worktime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="驾驶证" label-width="120px">
          <el-input v-model="form.license" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="违章次数" label-width="120px">
          <el-input v-model="form.violation" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="车牌号" label-width="120px">
          <el-input v-model="form.platenumber" autocomplete="off"></el-input>
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

export default {
  name: "DriversTable",
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
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
      }
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
      this.form.id = parseInt(Math.random() * 100) + 1024;
      createDriver(this.form).then(() => {
        this.list.unshift(this.form);
        this.dialogFormVisible = false;
        this.$message.success("创建成功！");
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
    },
    updateData() {
      updateVehicle(this.form).then(() => {
        const index = this.list.findIndex(item => item.id === this.form.id);
        this.list.splice(index, 1, this.form);
        this.dialogFormVisible = false;
        this.$message.success("修改成功！");
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
