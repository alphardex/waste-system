<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.platenumber"
        placeholder="车牌号"
        clearable
        @input="handleFilter"
      ></el-input>
      <el-input-number
        v-model="listQuery.age"
        placeholder="使用年数"
        @change="handleFilter"
        :min="0"
        :max="100"
        label="使用年数"
      ></el-input-number>
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
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        :class-name="getSortClass('id')"
      >
      </el-table-column>
      <el-table-column label="车牌号" prop="platenumber"></el-table-column>
      <el-table-column label="购买时间" prop="buytime"></el-table-column>
      <el-table-column label="购买金额(元)" prop="cost"></el-table-column>
      <el-table-column label="车辆型号" prop="typenumber"></el-table-column>
      <el-table-column label="载重量(吨)" prop="capacity"></el-table-column>
      <el-table-column label="行驶里程(千米)" prop="mileage"></el-table-column>
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
    <el-dialog title="新建垃圾车" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="车牌号" label-width="120px">
          <el-input v-model="form.platenumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="购买时间" label-width="120px">
          <el-input v-model="form.buytime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="购买金额(元)" label-width="120px">
          <el-input v-model="form.cost" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="车辆型号" label-width="120px">
          <el-input v-model="form.typenumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="载重量(吨)" label-width="120px">
          <el-input v-model="form.capacity" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="行驶里程(千米)" label-width="120px">
          <el-input v-model="form.mileage" autocomplete="off"></el-input>
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
import { fetchList, createVehicle, updateVehicle } from "@/api/vehicles";
import Pagination from "@/components/Pagination";

export default {
  name: "VehiclesTable",
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        age: undefined,
        platenumber: undefined,
        sort: "+id"
      },
      total: 0,
      sortOptions: [
        { label: "升序", key: "+id" },
        { label: "降序", key: "-id" }
      ],
      dialogFormVisible: false,
      dialogStatus: "",
      form: {
        id: null,
        platenumber: "",
        buytime: "",
        cost: "",
        typenumber: "",
        capacity: "",
        mileage: ""
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
        platenumber: "",
        buytime: "",
        cost: "",
        typenumber: "",
        capacity: "",
        mileage: ""
      };
    },
    createData() {
      this.form.id = parseInt(Math.random() * 100) + 1024;
      createVehicle(this.form).then(() => {
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
