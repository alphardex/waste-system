const steps = [
  {
    element: '#container',
    popover: {
      title: '地图',
      description: '用于展示坐标点，单击点可编辑点信息',
      position: 'bottom'
    }
  },
  {
    element: '.dot-reader',
    popover: {
      title: '导入点坐标',
      description: '导入事先用ArcGIS导出的点坐标集合',
      position: 'bottom'
    }
  },
  {
    element: '.clear',
    popover: {
      title: '清空点坐标',
      description: '清空地图上所有的点',
      position: 'bottom'
    }
  },
  {
    element: '.weight-range-control',
    popover: {
      title: '重量范围(吨)',
      description: '以重量范围(吨)来筛选投放点',
      position: 'bottom'
    }
  },
  {
    element: '.add-vehicle',
    popover: {
      title: '添加垃圾车',
      description: '开启则能在地图上点击时添加垃圾车点',
      position: 'bottom'
    }
  },
  {
    element: '.select-point-mode',
    popover: {
      title: '点选择',
      description: '开启则能在地图上选中想要的点（变绿）',
      position: 'bottom'
    }
  },
  {
    element: '.clear-select',
    popover: {
      title: '清空点选择',
      description: '取消选中的所有点',
      position: 'bottom'
    }
  },
  {
    element: '.calc-distance',
    popover: {
      title: '计算两点间距离',
      description: '计算选中的两点的距离',
      position: 'bottom'
    }
  },
  {
    element: '.route-planning',
    popover: {
      title: '路径规划',
      description: '规划选中点的路径（第一个必须是垃圾车）',
      position: 'bottom'
    }
  }
]

export default steps

