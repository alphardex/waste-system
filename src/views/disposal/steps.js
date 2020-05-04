const steps = [
  {
    element: '#container',
    popover: {
      title: '地图',
      description: '用于投放点的展示和交互',
      position: 'left'
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
    element: '.dot-data',
    popover: {
      title: '投放点数据表',
      description: '用来展示和操作导入的投放点数据',
      position: 'top'
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
      description: '开启则能选中想要的点，关闭则清空已选点',
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
  },
  {
    element: '.user-avatar',
    popover: {
      title: '功能菜单',
      description: '各种功能（例如登出等）',
      position: 'left'
    }
  }
]

export default steps

