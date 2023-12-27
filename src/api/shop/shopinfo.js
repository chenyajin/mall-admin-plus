import request from '@/utils/request'

// 查询门店列表
export function listShopInfo(query) {
  return request({
    url: '/shop/shopinfo/list',
    method: 'get',
    params: query
  })
}

export function listAllShopinfo() {
  return request({
    url: '/shop/shopinfo/queryAllShopList',
    method: 'get'
  })
}

export function queryShopAnalysisData() {
  return request({
    url: '/shop/shopinfo/getShopAnalysisData',
    method: 'get'
  })
}

// 查询门店详细
export function getShopInfo(id) {
  return request({
    url: '/shop/shopinfo/' + id,
    method: 'get'
  })
}

// 新增门店
export function addShopInfo(data) {
  return request({
    url: '/shop/shopinfo',
    method: 'post',
    data: data
  })
}

// 修改门店
export function updateShopInfo(data) {
  return request({
    url: '/shop/shopinfo',
    method: 'put',
    data: data
  })
}

// 删除门店
export function delShopInfo(id) {
  return request({
    url: '/shop/shopinfo/' + id,
    method: 'delete'
  })
}

// 导出门店
export function exportShopInfo(query) {
  return request({
    url: '/shop/shopinfo/export',
    method: 'get',
    params: query
  })
}
