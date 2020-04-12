import Mock from 'mockjs'

const data = Mock.mock({
  'items|1000': [
    {
      id: '@increment',
      name: '@cname',
      'gender|1': ['男', '女'],
      birthdate: '@date',
      phone: /^1[385][1-9]\d{8}/,
      worktime: "@date('yyyy')",
      'license|1': ['A', 'B', 'C'],
      violation: '@integer(0, 5)',
      platenumber: /[苏][A-N]\d{5}/
    }
  ]
})

export default [
  {
    url: '/vue-admin-template/drivers/list',
    type: 'get',
    response: config => {
      const { page, limit, name, gender, sort } = config.query

      const items = data.items

      let filteredItems = items.filter(item => {
        if (name && !item.name.includes(name)) {
          return false
        }
        if (gender && item.gender !== gender) {
          return false
        }
        return true
      })

      if (sort === '-id') {
        filteredItems = filteredItems.reverse()
      }

      const pageList = filteredItems.filter(
        (item, i) => i < limit * page && i >= limit * (page - 1)
      )

      return {
        code: 20000,
        data: {
          total: filteredItems.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/vue-admin-template/drivers/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-admin-template/drivers/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
