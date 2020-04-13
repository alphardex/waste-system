import Mock from 'mockjs'

const data = Mock.mock({
  'items|500': [{
    id: '@increment',
    platenumber: /[苏][A-N]\d{5}/,
    buytime: '@date',
    cost: '@integer(50000, 200000)',
    typenumber: '@word(10)',
    capacity: '30',
    mileage: '@integer(0, 1000)'
  }]
})

export default [{
  url: '/vue-admin-template/vehicles/list',
  type: 'get',
  response: config => {
    const {
      page,
      limit,
      age,
      platenumber,
      sort
    } = config.query

    const items = data.items

    let filteredItems = items.filter(item => {
      const buyYear = parseInt(item.buytime.slice(0, 4))
      const nowYear = new Date().getFullYear()
      const timeDelta = nowYear - buyYear
      if (age && parseInt(age) !== timeDelta) {
        return false
      }
      if (platenumber && !item.platenumber.includes(platenumber)) {
        return false
      }
      return true
    })

    if (sort === '-id') {
      filteredItems = filteredItems.reverse()
    }

    const pageList = filteredItems.filter((item, i) => i < limit * page && i >= limit * (page - 1))

    return {
      code: 20000,
      data: {
        total: filteredItems.length,
        items: pageList
      }
    }
  }
}, {
  url: '/vue-admin-template/vehicles/create',
  type: 'post',
  response: _ => {
    return {
      code: 20000,
      data: 'success'
    }
  }
}, {
  url: '/vue-admin-template/vehicles/update',
  type: 'post',
  response: _ => {
    return {
      code: 20000,
      data: 'success'
    }
  }
}]
