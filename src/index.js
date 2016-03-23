'use strict'
let ajax = require('./ajax').default

let source_table = (function () {
  // API URL
  const BASE_URL = 'https://source.fap.no/api/v1'
  const TIMEOUT = 5000

  // Datastore
  let servers = []

  // HTML elements
  let entry_div = document.getElementById('source_table')

  let get_row_by_server_id = function (table, server_id) {
    for (let i = 0; i < table.children.length; i++) {
      let child = table.children[i]
      if (child.dataset.identifier === server_id) {
        return child
      }
    }
    return null
  }

  let insert_in_order = function (table, new_row) {
    let new_name = new_row.children[0].innerHTML
    console.log('insert')

    if (table.children.length === 1) {
      console.log('adding first child')
      table.appendChild(new_row)
      return
    }
    for (let i = 1; i < table.children.length; i++) {
      let current_row = table.children[i]
      let current_name = current_row.children[0].innerHTML
      if (new_name < current_name) {
        table.insertBefore(new_row, current_row)
        return
      }
    }
    table.appendChild(new_row)
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

  let poll_server = function (server) {
    // console.log(`Polling server: ${server} at `, Date.now())
    let payload = {data: server}
    let promise = ajax.post(BASE_URL + '/all', payload)
    promise.then(function (response) {
      let parsed_response = JSON.parse(response)
      let server_info = parsed_response.data[server]
      update_row(server, server_info)
    })
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
      // table.appendChild(row)
      insert_in_order(table, row)
    }
    setTimeout(function () {
      poll_server(server_id)
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

window.source_table = source_table
