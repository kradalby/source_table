// @flow
'use strict'

let Ajax = (function () {
  let get = function (url: string): Promise {
    return new Promise(function (resolve, reject) {
      let request = new XMLHttpRequest()
      request.open('GET', url)
      request.onload = function () {
        if (request.status === 200) {
          resolve(request.response)
        } else {
          reject(new Error(request.statusText))
        }
      }

      request.onerror = function () {
        reject(new Error('Network error'))
      }

      request.send()
    })
  }

  let post = function (url: string, data: JSON): Promise {
    return new Promise(function (resolve, reject) {
      let request = new XMLHttpRequest()
      request.open('POST', url)
      request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      request.onload = function () {
        if (request.status === 200) {
          resolve(request.response)
        } else {
          reject(new Error(request.statusText))
        }
      }

      request.onerror = function () {
        reject(new Error('Network error'))
      }

      request.send(JSON.stringify(data))
    })
  }

  return {
    get: get,
    post: post
  }
})()

export default Ajax