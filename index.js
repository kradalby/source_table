'use strict'
let ajax = require('./ajax').default

let servers = [
  '193.202.115.74:27115',
  '193.202.115.74:27117',
  '193.202.115.74:27121',
  '193.202.115.74:27123',
  '193.202.115.74:27125',
  '193.202.115.74:27127',
  '193.202.115.74:27129',
  '193.202.115.74:27133',
  '193.202.115.74:27137',
  '193.202.115.74:27139',
  '193.202.115.82:27115',
  '193.202.115.82:27117',
  '193.202.115.82:27119'
]

let source_table = (function () {
  // API URL
  const BASE_URL = 'https://source.fap.no/api/v1'
  const TIMEOUT = 3000

  // Datastore
  let servers = []

  // HTML elements
  let entry_div = document.getElementById('source_table')
  console.log(entry_div)

  let poll_server = function (server) {
    let payload = {data: server}
    console.log(payload)
    let promise = ajax.post(BASE_URL + '/all', payload)
    promise.then(function (response) {
      let parsed_response = JSON.parse(response)
      let server_info = parsed_response.data[server]
      console.log(server_info)
      update_row(server, server_info)
    })
  }

  let get_row_by_server_id = function (table, server_id) {
    for (let i = 0; i < table.children.length; i++) {
      let child = table.children[i]
      if (child.dataset.identifier === server_id) {
        return child
      }
    }
    return null
  }

  let initialize_table = function () {
    let table = document.createElement('table')
    let row = document.createElement('tr')
    let name = document.createElement('th')
    let game = document.createElement('th')
    let map = document.createElement('th')
    let players = document.createElement('th')
    let address = document.createElement('th')

    name.innerHTML = 'Name'
    game.innerHTML = 'Game'
    map.innerHTML = 'Map'
    players.innerHTML = 'Players'
    address.innerHTML = 'Address'

    row.dataset.identifier = 'header_row'

    row.appendChild(name)
    row.appendChild(game)
    row.appendChild(map)
    row.appendChild(players)
    row.appendChild(address)
    table.appendChild(row)
    entry_div.appendChild(table)
  }

  let update_row = function (server_id, server_info) {
    let table = entry_div.firstChild

    let row = document.createElement('tr')
    let name = document.createElement('td')
    let game = document.createElement('td')
    let map = document.createElement('td')
    let players = document.createElement('td')
    let address = document.createElement('td')

    name.innerHTML = server_info.hostname
    game.innerHTML = server_info.gamedesc
    map.innerHTML = server_info.map
    players.innerHTML = `${server_info.players.length}/${server_info.maxplayers}`
    address.innerHTML = server_id

    row.dataset.identifier = server_id

    row.appendChild(name)
    row.appendChild(game)
    row.appendChild(map)
    row.appendChild(players)
    row.appendChild(address)

    let existing_row = get_row_by_server_id(table, server_id)

    if (existing_row) {
      table.replaceChild(row, existing_row)
    } else {
      table.appendChild(row)
    }
    setTimeout(function () {
      update_row(server_id, server_info)
    }, TIMEOUT)
  }

  let set_servers = function (server_list) {
    servers = server_list
    entry_div.innerHTML = ''
    initialize_table()
    servers.forEach(server => {
      poll_server(server)
    })
  }

  return {
    servers: set_servers
  }
})()

source_table.servers(servers)
