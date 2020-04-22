<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.platenumber"
        placeholder="车牌号"
        clearable
        @input="handleFilter"
      />
      <el-input-number
        v-model="listQuery.age"
        placeholder="使用年数"
        :min="0"
        :max="100"
        label="使用年数"
        @change="handleFilter"
      />
      <el-select v-model="listQuery.sort" @change="handleFilter">
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :value="item.key"
          :label="item.label"
        />
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >添加</el-button>
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
      />
      <el-table-column label="车牌号" prop="platenumber" />
      <el-table-column label="购买时间" prop="buytime">
        <template slot-scope="{ row }">
          <span>{{ row.buytime | parseTime("{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买金额(元)" prop="cost" />
      <el-table-column label="车辆型号" prop="typenumber" />
      <el-table-column label="载重量(吨)" prop="capacity" />
      <el-table-column label="行驶里程(公里)" prop="mileage" />
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{ row, $index }">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handleUpdate(row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(row, $index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog
      :title="dialogStatus === 'create' ? '添加垃圾车信息' : '修改垃圾车信息'"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="车牌号" label-width="120px" prop="platenumber">
          <el-input v-model="form.platenumber" autocomplete="off" />
        </el-form-item>
        <el-form-item label="购买时间" label-width="120px" prop="buytime">
          <el-date-picker v-model="form.buytime" />
        </el-form-item>
        <el-form-item label="购买金额(元)" label-width="120px" prop="cost">
          <el-input v-model.number="form.cost" autocomplete="off" />
        </el-form-item>
        <el-form-item label="车辆型号" label-width="120px" prop="typenumber">
          <el-input v-model="form.typenumber" autocomplete="off" />
        </el-form-item>
        <el-form-item label="载重量(吨)" label-width="120px" prop="capacity">
          <el-input v-model="form.capacity" autocomplete="off" />
        </el-form-item>
        <el-form-item label="行驶里程(公里)" label-width="120px">
          <el-input v-model="form.mileage" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createVehicle, updateVehicle } from '@/api/vehicles'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'

export default {
  name: 'VehiclesTable',
  components: { Pagination },
  filters: {
    parseTime
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        age: undefined,
        platenumber: undefined,
        sort: '+id'
      },
      total: 0,
      sortOptions: [
        { label: '升序', key: '+id' },
        { label: '降序', key: '-id' }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      form: {
        id: null,
        platenumber: '',
        buytime: '',
        cost: '',
        typenumber: '',
        capacity: '',
        mileage: ''
      },
      rules: {
        platenumber: [
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          {
            pattern: /^(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(?:(?:[0-9]{5}[DF])|(?:[DF](?:[A-HJ-NP-Z0-9])[0-9]{4})))|(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/,
            message: '车牌号格式不对',
            trigger: 'blur'
          }
        ],
        buytime: [
          { required: true, message: '请选择购买时间', trigger: 'blur' }
        ],
        cost: [
          {
            required: true,
            type: 'number',
            message: '请输入购买金额',
            trigger: 'blur'
          }
        ],
        typenumber: [
          { required: true, message: '请输入车辆型号', trigger: 'blur' }
        ],
        capacity: [
          {
            required: true,
            message: '请输入载重量',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      this.listQuery.sort = order === 'ascending' ? '+id' : '-id'
      this.handleFilter()
    },
    getSortClass(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    handleCreate() {
      this.resetForm()
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    resetForm() {
      this.form = {
        platenumber: '',
        buytime: '',
        cost: '',
        typenumber: '',
        capacity: '',
        mileage: ''
      }
    },
    createData() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.form.id = parseInt(Math.random() * 100) + 1024
          createVehicle(this.form).then(() => {
            this.list.unshift(this.form)
            this.dialogFormVisible = false
            this.$message.success('创建成功！')
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$message.success('删除成功！')
      this.list.splice(index, 1)
    },
    handleUpdate(row) {
      this.form = { ...row }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          updateVehicle(this.form).then(() => {
            const index = this.list.findIndex(item => item.id === this.form.id)
            this.list.splice(index, 1, this.form)
            this.dialogFormVisible = false
            this.$message.success('修改成功！')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.filter-container {
  margin-bottom: 20px;

  & > * {
    margin-right: 0.5rem;
  }
}

.el-input {
  width: 200px;
}

.el-select {
  width: 90px;
}
</style>
