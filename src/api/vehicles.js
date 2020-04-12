import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-admin-template/vehicles/list',
    method: 'get',
    params: query
  })
}

export function createVehicle(data) {
  return request({
    url: '/vue-admin-template/vehicles/create',
    method: 'post',
    data
  })
}

export function updateVehicle(data) {
  return request({
    url: '/vue-admin-template/vehicles/update',
    method: 'post',
    data
  })
}
