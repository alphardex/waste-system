import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/waste-system/vehicles/list',
    method: 'get',
    params: query
  })
}

export function createVehicle(data) {
  return request({
    url: '/waste-system/vehicles/create',
    method: 'post',
    data
  })
}

export function updateVehicle(data) {
  return request({
    url: '/waste-system/vehicles/update',
    method: 'post',
    data
  })
}
