<template>
  <div class="app-container">
    <div id="operation-container">
      <div class="dot-operations">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-change="handleChange"
          :show-file-list="false"
          accept=".csv, .txt"
          class="dot-reader"
        >
          <el-button round size="mini" type="primary" icon="el-icon-add-location">导入点坐标</el-button>
        </el-upload>
        <el-button
          round
          size="mini"
          type="danger"
          class="clear"
          icon="el-icon-delete-location"
          @click="handleClear"
        >清空点坐标</el-button>
        <el-button
          round
          size="mini"
          type="info"
          class="calc-distance"
          icon="el-icon-data-line"
          @click="handleCalcDistance"
        >计算两点间距离</el-button>
        <el-button
          round
          size="mini"
          type="primary"
          class="route-planning"
          icon="el-icon-discover"
          @click="handleRoutePlanning"
        >路径规划</el-button>
        <el-button
          round
          size="mini"
          type="success"
          class="guide"
          icon="el-icon-question"
          @click.prevent.stop="handleGuide"
        >新手指引</el-button>
      </div>
      <div class="vehicle-control">
        <ul class="function-list">
          <li class="function-list__item" style="--function-color: var(--danger-color);">
            <div class="function">
              <div class="function-icon">
                <svg-icon icon-class="truck" />
              </div>
              <div class="function-menu">
                <svg-icon icon-class="menu" />
              </div>
            </div>
            <div class="function-data">
              <div class="function-name">添加垃圾车模式</div>
              <div class="function-switch">
                <el-switch
                  v-model="addVehicle"
                  class="add-vehicle"
                  active-color="var(--function-color)"
                  inactive-color="var(--function-color)"
                  @change="handleVehicleMode"
                />
              </div>
            </div>
          </li>
          <li class="function-list__item" style="--function-color: var(--primary-color);">
            <div class="function">
              <div class="function-icon">
                <svg-icon icon-class="marker" />
              </div>
              <div class="function-menu">
                <svg-icon icon-class="menu" />
              </div>
            </div>
            <div class="function-data">
              <div class="function-name">点选择模式</div>
              <div class="function-switch">
                <el-switch
                  v-model="selectPointMode"
                  class="select-point-mode"
                  active-color="var(--function-color)"
                  inactive-color="var(--function-color)"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="weight-range-control">
        <el-slider v-model="weightRange" range @change="handleFilter" />
      </div>
      <el-table
        v-loading="listLoading"
        element-loading-text="拼命加载中"
        :data="activePoints"
        border
        height="250"
        size="mini"
        class="dot-data"
      >
        <el-table-column label="ID" prop="id" />
        <el-table-column label="X" prop="x" />
        <el-table-column label="Y" prop="y" />
        <el-table-column label="重量(吨)" prop="weight" />
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleUpdate(row)">修改</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(row, $index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="'修改投放点' + form.id + '信息'" :visible.sync="dialogFormVisible">
        <el-form ref="ruleForm" :model="form" :rules="rules">
          <el-form-item label="X" label-width="120px" prop="x">
            <el-input v-model="form.x" auto-complete="off" />
          </el-form-item>
          <el-form-item label="Y" label-width="120px" prop="y">
            <el-input v-model="form.y" auto-complete="off" />
          </el-form-item>
          <el-form-item label="重量(吨)" label-width="120px" prop="weight">
            <el-input v-model="form.weight" auto-complete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateData">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div id="map-container">
      <div id="container" />
      <div id="panel" />
    </div>
  </div>
</template>

<script>
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
import steps from './steps'
const DEFAULT_MARKER_ICON =
  '<svg t="1586837399316" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2975" width="24" height="24"><path d="M512.434393 66.861804c-0.054235 0-0.109494 0-0.163729 0l-0.541329 0c-0.056282 0-0.109494 0-0.163729 0-191.363376 0.434905-346.930477 156.1115-346.930477 347.637582 0 188.810227 119.553886 338.510714 326.018192 532.535709 0.325411 0.434905 0.434905 0.977257 0.814552 1.302669 3.042289 3.260254 6.735401 5.432733 10.646478 6.843872 0.923022 0.325411 1.954515 0.325411 2.933819 0.543376 2.226714 0.542352 4.399193 1.412163 6.681166 1.412163 0.107447 0 0.161682-0.10847 0.270153-0.10847 0.109494 0 0.163729 0.10847 0.272199 0.10847 2.281973 0 4.455475-0.86981 6.681166-1.412163 0.977257-0.217964 2.010797-0.217964 2.933819-0.543376 3.90903-1.412163 7.605212-3.584642 10.646478-6.843872 0.379647-0.325411 0.488117-0.868787 0.813528-1.302669 206.464305-194.024995 326.019215-343.725482 326.019215-532.535709C859.364871 222.973304 703.796746 67.296709 512.434393 66.861804zM511.998465 596.247776c-101.193727 0-183.541223-82.347496-183.541223-183.596482 0-101.247962 82.347496-183.486988 183.541223-183.486988 101.195773 0 183.541223 82.238003 183.541223 183.486988C695.539688 513.901303 613.194238 596.247776 511.998465 596.247776z" p-id="2976" fill="#409EFF"></path></svg>'
const SELECTED_MARKER_ICON =
  '<svg t="1586837399316" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2975" width="24" height="24"><path d="M512.434393 66.861804c-0.054235 0-0.109494 0-0.163729 0l-0.541329 0c-0.056282 0-0.109494 0-0.163729 0-191.363376 0.434905-346.930477 156.1115-346.930477 347.637582 0 188.810227 119.553886 338.510714 326.018192 532.535709 0.325411 0.434905 0.434905 0.977257 0.814552 1.302669 3.042289 3.260254 6.735401 5.432733 10.646478 6.843872 0.923022 0.325411 1.954515 0.325411 2.933819 0.543376 2.226714 0.542352 4.399193 1.412163 6.681166 1.412163 0.107447 0 0.161682-0.10847 0.270153-0.10847 0.109494 0 0.163729 0.10847 0.272199 0.10847 2.281973 0 4.455475-0.86981 6.681166-1.412163 0.977257-0.217964 2.010797-0.217964 2.933819-0.543376 3.90903-1.412163 7.605212-3.584642 10.646478-6.843872 0.379647-0.325411 0.488117-0.868787 0.813528-1.302669 206.464305-194.024995 326.019215-343.725482 326.019215-532.535709C859.364871 222.973304 703.796746 67.296709 512.434393 66.861804zM511.998465 596.247776c-101.193727 0-183.541223-82.347496-183.541223-183.596482 0-101.247962 82.347496-183.486988 183.541223-183.486988 101.195773 0 183.541223 82.238003 183.541223 183.486988C695.539688 513.901303 613.194238 596.247776 511.998465 596.247776z" p-id="2976" fill="#67C23A"></path></svg>'
const DEFAULT_VEHICLE_ICON =
  '<svg t="1586833533591" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1940" width="24" height="24"><path d="M672 400h80v352h-80z" fill="#5C546A" p-id="1941"></path><path d="M960 784H64c-17.674 0-32-14.326-32-32v-32h960v32c0 17.674-14.326 32-32 32z" fill="#5C546A" p-id="1942"></path><path d="M984.062 494.918l-155.766-217.16A16.016 16.016 0 0 0 816 272h-64c-8.844 0-16 7.164-16 16v432c0 8.836 7.156 16 16 16h224c26.468 0 48-21.532 48-48v-145.762c0-23.726-17.296-43.484-39.938-47.32z" fill="#FF4F19" p-id="1943"></path><path d="M893.404 288c20.66 0 39.004 13.22 45.536 32.822l45.122 174.096s-115.088-23.386-148.982-32.68C814.286 456.538 800 437.56 800 416v-128h93.404z" fill="#5C546A" p-id="1944"></path><path d="M800 304c-8.844 0-16-7.164-16-16v-76.118c0-8.54-3.328-16.578-9.376-22.632l-17.938-17.938c-6.25-6.25-6.25-16.376 0-22.626s16.376-6.25 22.626 0l17.938 17.938c12.094 12.102 18.75 28.172 18.75 45.258V288c0 8.836-7.156 16-16 16z" fill="#8A8895" p-id="1945"></path><path d="M656 208H48c-26.468 0-48 21.532-48 48v432c0 26.468 21.532 48 48 48h640c8.844 0 16-7.164 16-16V256c0-26.468-21.532-48-48-48z" fill="#527991" p-id="1946"></path><path d="M0 688c0 26.468 21.532 48 48 48h640c8.844 0 16-7.164 16-16v-112H0v80z" fill="#5D647F" p-id="1947"></path><path d="M496 816h-128c-17.674 0-32-14.326-32-32v-32c0-17.674 14.326-32 32-32h128c17.674 0 32 14.326 32 32v32c0 17.674-14.326 32-32 32z" fill="#8A8895" p-id="1948"></path><path d="M384 784c-4.156 0-8.328-1.766-11.36-4.64-2.89-3.04-4.64-7.204-4.64-11.36 0-4.164 1.75-8.32 4.64-11.36 6.078-5.922 16.796-5.922 22.718 0 2.876 3.04 4.64 7.196 4.64 11.36 0 4.156-1.766 8.32-4.796 11.36-2.89 2.874-7.046 4.64-11.202 4.64z" fill="#5C546A" p-id="1949"></path><path d="M968 608c-13.254 0-24 10.746-24 24s10.746 24 24 24h24v-48h-24z" fill="#FFD100" p-id="1950"></path><path d="M192 768m-112 0a112 112 0 1 0 224 0 112 112 0 1 0-224 0Z" fill="#5C546A" p-id="1951"></path><path d="M192 768m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#8A8895" p-id="1952"></path><path d="M832 768m-112 0a112 112 0 1 0 224 0 112 112 0 1 0-224 0Z" fill="#5C546A" p-id="1953"></path><path d="M832 768m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#8A8895" p-id="1954"></path><path d="M992 608h32v48h-32z" fill="#FFFFFF" p-id="1955"></path><path d="M944 272h-192a16 16 0 0 0-16 16v16h208c8.844 0 16-7.164 16-16s-7.156-16-16-16z" fill="#E7001E" p-id="1956"></path></svg>'
const SELECTED_VEHICLE_ICON =
  '<svg t="1586841754209" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1826" width="24" height="24"><path d="M672 400h80v352h-80z" fill="#5C546A" p-id="1827"></path><path d="M960 784H64c-17.674 0-32-14.326-32-32v-32h960v32c0 17.674-14.326 32-32 32z" fill="#5C546A" p-id="1828"></path><path d="M984.062 494.918l-155.766-217.16A16.016 16.016 0 0 0 816 272h-64c-8.844 0-16 7.164-16 16v432c0 8.836 7.156 16 16 16h224c26.468 0 48-21.532 48-48v-145.762c0-23.726-17.296-43.484-39.938-47.32z" fill="#FF4F19" p-id="1829"></path><path d="M893.404 288c20.66 0 39.004 13.22 45.536 32.822l45.122 174.096s-115.088-23.386-148.982-32.68C814.286 456.538 800 437.56 800 416v-128h93.404z" fill="#5C546A" p-id="1830"></path><path d="M800 304c-8.844 0-16-7.164-16-16v-76.118c0-8.54-3.328-16.578-9.376-22.632l-17.938-17.938c-6.25-6.25-6.25-16.376 0-22.626s16.376-6.25 22.626 0l17.938 17.938c12.094 12.102 18.75 28.172 18.75 45.258V288c0 8.836-7.156 16-16 16z" fill="#8A8895" p-id="1831"></path><path d="M656 208H48c-26.468 0-48 21.532-48 48v432c0 26.468 21.532 48 48 48h640c8.844 0 16-7.164 16-16V256c0-26.468-21.532-48-48-48z" fill="#1afa29" p-id="1832" data-spm-anchor-id="a313x.7781069.0.i2" class="selected"></path><path d="M0 688c0 26.468 21.532 48 48 48h640c8.844 0 16-7.164 16-16v-112H0v80z" fill="#5D647F" p-id="1833" data-spm-anchor-id="a313x.7781069.0.i3" class="selected"></path><path d="M496 816h-128c-17.674 0-32-14.326-32-32v-32c0-17.674 14.326-32 32-32h128c17.674 0 32 14.326 32 32v32c0 17.674-14.326 32-32 32z" fill="#8A8895" p-id="1834"></path><path d="M384 784c-4.156 0-8.328-1.766-11.36-4.64-2.89-3.04-4.64-7.204-4.64-11.36 0-4.164 1.75-8.32 4.64-11.36 6.078-5.922 16.796-5.922 22.718 0 2.876 3.04 4.64 7.196 4.64 11.36 0 4.156-1.766 8.32-4.796 11.36-2.89 2.874-7.046 4.64-11.202 4.64z" fill="#5C546A" p-id="1835"></path><path d="M968 608c-13.254 0-24 10.746-24 24s10.746 24 24 24h24v-48h-24z" fill="#FFD100" p-id="1836"></path><path d="M192 768m-112 0a112 112 0 1 0 224 0 112 112 0 1 0-224 0Z" fill="#5C546A" p-id="1837"></path><path d="M192 768m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#8A8895" p-id="1838"></path><path d="M832 768m-112 0a112 112 0 1 0 224 0 112 112 0 1 0-224 0Z" fill="#5C546A" p-id="1839"></path><path d="M832 768m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#8A8895" p-id="1840"></path><path d="M992 608h32v48h-32z" fill="#FFFFFF" p-id="1841"></path><path d="M944 272h-192a16 16 0 0 0-16 16v16h208c8.844 0 16-7.164 16-16s-7.156-16-16-16z" fill="#E7001E" p-id="1842"></path></svg>'

export default {
  data() {
    return {
      map: null,
      points: [],
      activePoints: [],
      markers: [],
      listLoading: false,
      weightRange: [0, 100],
      dialogFormVisible: false,
      addVehicle: false,
      clickListener: null,
      vehicleMarkers: [],
      selectPointMode: false,
      selectedPoints: [],
      driver: null,
      truckDriving: null,
      form: {
        id: null,
        x: '',
        y: '',
        weight: ''
      },
      rules: {
        x: [
          {
            required: true,
            message: '请输入x坐标',
            trigger: 'blur'
          }
        ],
        y: [
          {
            required: true,
            message: '请输入y坐标',
            trigger: 'blur'
          }
        ],
        weight: [
          {
            required: true,
            message: '请输入重量',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    const map = new AMap.Map('container', {
      zoom: 9, // 级别
      center: [117.154169953999997, 34.1823933254], // 中心点坐标,
      reiszeEnable: true
    })
    this.map = map
    AMap.plugin('AMap.TruckDriving', () => {
      const truckOptions = {
        map: this.map,
        policy: 0,
        size: 1,
        city: 'jiangsu',
        panel: 'panel'
      }
      const truckDriving = new AMap.TruckDriving(truckOptions)
      map.addControl(truckDriving)
      this.truckDriving = truckDriving
    })
    this.driver = new Driver({
      closeBtnText: '关闭',
      prevBtnText: '后退',
      nextBtnText: '前进',
      doneBtnText: '结束'
    })
  },
  methods: {
    handleChange(file, fileList) {
      const reader = new FileReader()
      reader.readAsText(file.raw)
      reader.onload = e => {
        const data = e.target.result
        const array = this.CSVToArray(data)
        const xycoords = array.map(item => item.slice(2))
        const points = xycoords.map((item, i) => ({
          id: i + 1,
          x: item[0],
          y: item[1],
          weight: 0
        }))
        this.points = points
        this.activePoints = [...points]
        this.updateMap(points)
      }
    },
    CSVToArray(data, delimiter = ',', omitFirstRow = true) {
      return data
        .slice(omitFirstRow ? data.indexOf('\n') + 1 : 0)
        .split('\n')
        .map(v => v.split(delimiter))
    },
    updateMap(points) {
      this.map.clearMap()
      const markers = points.map((item, i) => {
        if (item.x === 'nan' || item.y === 'nan') {
          return undefined
        } else {
          return new AMap.Marker({
            position: new AMap.LngLat(item.x, item.y),
            title: `投放点${i + 1}\n重量: ${item.weight}吨`,
            content: DEFAULT_MARKER_ICON
          })
        }
      })
      this.markers = markers
      this.markers.forEach(item =>
        item.on('click', e => this.handleClickMarker(e))
      )
      this.map.add(markers)
    },
    getMarkerId(marker) {
      return parseInt(marker.getTitle().slice(3))
    },
    handleClickMarker(e) {
      const marker = e.target
      const id = this.getMarkerId(marker)
      const row = this.markers[id - 1]
      if (this.selectPointMode) {
        if (!this.selectedPoints.includes(row)) {
          marker.setContent(SELECTED_MARKER_ICON)
          this.selectedPoints.push(row)
        } else {
          marker.setContent(DEFAULT_MARKER_ICON)
          this.selectedPoints = this.selectedPoints.filter(
            item => item !== row
          )
        }
      } else {
        const data = this.activePoints[id - 1]
        this.form = { ...data }
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      }
    },
    handleClickVehicleMarker(e) {
      const vehicleMarker = e.target
      const id = this.getMarkerId(vehicleMarker)
      const row = this.vehicleMarkers[id - 1]
      if (this.selectPointMode) {
        if (!this.selectedPoints.includes(row)) {
          vehicleMarker.setContent(SELECTED_VEHICLE_ICON)
          this.selectedPoints.push(row)
        } else {
          vehicleMarker.setContent(DEFAULT_VEHICLE_ICON)
          this.selectedPoints = this.selectedPoints.filter(
            item => item !== row
          )
        }
      }
    },
    handleFilter() {
      this.activePoints = [...this.points].filter(
        item =>
          item.weight >= this.weightRange[0] &&
          item.weight <= this.weightRange[1]
      )
      this.updateMap(this.activePoints)
    },
    handleClear() {
      this.map.clearMap()
      this.points = []
      this.activePoints = []
      this.$message.success('点坐标已清空！')
    },
    handleUpdate(row) {
      this.form = {
        ...row
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          const index = this.points.findIndex(item => item.id === this.form.id)
          this.points.splice(index, 1, this.form)
          this.activePoints = [...this.points]
          this.handleFilter()
          this.dialogFormVisible = false
          this.$message.success('修改成功！')
        }
      })
    },
    handleDelete(row, index) {
      this.$message.success('删除成功！')
      this.points.splice(index, 1)
      this.activePoints = [...this.points]
      this.updateMap(this.activePoints)
    },
    handleVehicleMode(value) {
      if (value) {
        this.clickListener = AMap.event.addListener(this.map, 'click', e => {
          const marker = new AMap.Marker({
            position: e.lnglat,
            map: this.map,
            title: `垃圾车${this.vehicleMarkers.length + 1}`,
            content: DEFAULT_VEHICLE_ICON,
            offset: new AMap.Pixel(-12, -12),
            draggable: true
          })
          marker.on('click', e => this.handleClickVehicleMarker(e))
          this.vehicleMarkers.push(marker)
          this.map.add(marker)
        })
      } else {
        AMap.event.removeListener(this.clickListener)
      }
    },
    handleCalcDistance() {
      if (this.selectedPoints.length !== 2) {
        this.$notify({
          title: '两点距离计算',
          message: '请先选中两个点',
          type: 'warning',
          duration: 3000
        })
      } else {
        const [point1, point2] = this.selectedPoints
        const p1 = point1.getPosition()
        const p2 = point2.getPosition()
        const distance = AMap.GeometryUtil.distance(p1, p2)
        this.$notify({
          title: '两点距离计算',
          message: `结果：${distance}`,
          type: 'success',
          duration: 0
        })
      }
    },
    handleGuide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    },
    handleRoutePlanning() {
      const path = this.selectedPoints.map(point => {
        const pos = point.getPosition()
        const [x, y] = [pos.lng, pos.lat]
        return { lnglat: [x, y] }
      })
      if (path.length < 2) {
        this.$notify({
          title: '路径规划',
          message: '请先选中两个以上的点',
          type: 'warning',
          duration: 3000
        })
        return
      }
      this.truckDriving.search(path, (status, result) => {
        if (status === 'complete') {
          this.$message.success('路径规划成功！')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin pc-layout {
  @media screen and (min-width: 751px) {
    @content;
  }
}

@mixin sp-layout {
  @media screen and (max-width: 750px) {
    @content;
  }
}

@include pc-layout {
  .app-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

#container {
  width: 600px;
  height: 560px;
}

#operation-container {
  display: grid;
  gap: 1rem;
  padding: 20px;
  max-width: 320px;
}

#panel {
  position: fixed;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 10px;
  right: 10px;
  width: 280px;
}

#panel .amap-lib-driving {
  border-radius: 4px;
  overflow: hidden;
}

.dot-operations {
  display: flex;
  align-items: center;

  @include sp-layout {
    display: grid;
    grid-template-rows: repeat(5, 1fr);
    gap: 1rem;

    .dot-reader {
      margin-right: 0;

      & >>> .el-upload {
        display: block;
      }
    }

    .el-upload {
      width: 100%;

      .el-button {
        width: 100%;
      }
    }

    .el-button {
      margin-left: 0;
    }
  }
}

.dot-reader {
  margin-right: 10px;
}

.vehicle-control {
  display: flex;
  align-items: center;
  white-space: nowrap;

  & > * {
    margin-right: 1rem;
  }
}

.function-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  width: 100%;
  padding: 0;
  margin: 0;
  list-style-type: none;

  &__item {
    padding: 4px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: 0.3s;

    .function {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px;
      color: white;
      background: var(--function-color);
      border-radius: 15px;
    }

    .function-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
    }

    .function-data {
      display: flex;
      justify-content: space-between;
      padding: 30px 16px 21px 16px;
    }

    .function-name {
      margin-right: 22px;
      white-space: nowrap;
    }

    .function-switch {
      --switch-ball-color: var(--function-color);
      --switch-checked-color: var(--function-color);
      --border-color: var(--function-color);
      --switch-hover-color: transparent;
      --switch-disabled-checked-color: transparent;

      &:checked {
        --border-color: var(--function-color);
      }
    }

    &.update-function {
      &:hover {
        box-shadow: 0 0 0 1px var(--secondary-color-darker);
      }

      .function-icon {
        color: var(--secondary-color-darker);
        background: white;
      }

      .function-menu {
        color: var(--secondary-color-darker);
      }

      .function-switch {
        --switch-ball-color: var(--secondary-color-darker);
        --switch-checked-color: var(--secondary-color-darker);
        --border-color: var(--secondary-color-darker);
        --switch-hover-color: transparent;
        --switch-disabled-checked-color: transparent;

        &:checked {
          --border-color: var(--secondary-color-darker);
        }
      }
    }
  }
}
</style>
