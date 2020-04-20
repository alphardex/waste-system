import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/waste-system/drivers/list',
    method: 'get',
    params: query
  })
}

export function createDriver(data) {
  return request({
    url: '/waste-system/drivers/create',
    method: 'post',
    data
  })
}

export function updateDriver(data) {
  return request({
    url: '/waste-system/drivers/update',
    method: 'post',
    data
  })
}
