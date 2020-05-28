import { constantRoutes } from '@/router'
import {asyncRoutes } from '@/router/asyncRoutes'
/**
 * Use meta.role to determine if the current user has permission
 */
function hasPermission(path, path1) {
  if (path == path1) {
    return true
  } else {
    return false
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(asyncRoutes, roles) {
  let res = []
  res = asyncRoutes.filter(el=>{
      let cache = []
      el.children.forEach(val => {
          if(val.meta.roles.includes(roles)){
            cache.push(val)
          }
      })
      el.children=cache 
      return cache.length
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = routes.concat(constantRoutes)
  }
}

const actions = {
  generateRoutes({ commit }, [roles]) {
    return new Promise(resolve => {
      let accessedRoutes = []
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
