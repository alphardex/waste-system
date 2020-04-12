import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-admin-template/drivers/list',
    method: 'get',
    params: query
  })
}

export function createDriver(data) {
  return request({
    url: '/vue-admin-template/drivers/create',
    method: 'post',
    data
  })
}

export function updateDriver(data) {
  return request({
    url: '/vue-admin-template/drivers/update',
    method: 'post',
    data
  })
}
