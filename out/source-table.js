(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// @flow
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Ajax = function () {
  var get = function get(url) {
    return new Promise(function (resolve, reject) {
      var request = new XMLHttpRequest();
      request.open('GET', url);
      request.onload = function () {
        if (request.status === 200) {
          resolve(request.response);
        } else {
          reject(new Error(request.statusText));
        }
      };

      request.onerror = function () {
        reject(new Error('Network error'));
      };

      request.send();
    });
  };

  var post = function post(url, data) {
    return new Promise(function (resolve, reject) {
      var request = new XMLHttpRequest();
      request.open('POST', url);
      request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      request.onload = function () {
        if (request.status === 200) {
          resolve(request.response);
        } else {
          reject(new Error(request.statusText));
        }
      };

      request.onerror = function () {
        reject(new Error('Network error'));
      };

      request.send(JSON.stringify(data));
    });
  };

  return {
    get: get,
    post: post
  };
}();

exports.default = Ajax;

},{}],2:[function(require,module,exports){
'use strict';

var ajax = require('./ajax').default;

var servers = ['193.202.115.74:27115', '193.202.115.74:27117', '193.202.115.74:27121', '193.202.115.74:27123', '193.202.115.74:27125', '193.202.115.74:27127', '193.202.115.74:27129', '193.202.115.74:27133', '193.202.115.74:27137', '193.202.115.74:27139', '193.202.115.82:27115', '193.202.115.82:27117', '193.202.115.82:27119'];

var source_table = function () {
  // API URL
  var BASE_URL = 'http://127.0.0.1:5000/api/v1';
  var TIMEOUT = 5000;

  // Datastore
  var servers = [];

  // HTML elements
  var entry_div = document.getElementById('source_table');

  var get_row_by_server_id = function get_row_by_server_id(table, server_id) {
    for (var i = 0; i < table.children.length; i++) {
      var child = table.children[i];
      if (child.dataset.identifier === server_id) {
        return child;
      }
    }
    return null;
  };

  var insert_in_order = function insert_in_order(table, new_row) {
    var new_name = new_row.children[0].innerHTML;
    console.log('insert');

    if (table.children.length === 1) {
      console.log('adding first child');
      table.appendChild(new_row);
      return;
    }
    for (var i = 1; i < table.children.length; i++) {
      var current_row = table.children[i];
      var current_name = current_row.children[0].innerHTML;
      if (new_name < current_name) {
        table.insertBefore(new_row, current_row);
        return;
      }
    }
    table.appendChild(new_row);
  };

  var initialize_table = function initialize_table() {
    var table = document.createElement('table');
    var row = document.createElement('tr');
    var name = document.createElement('th');
    var game = document.createElement('th');
    var map = document.createElement('th');
    var players = document.createElement('th');
    var address = document.createElement('th');

    name.innerHTML = 'Name';
    game.innerHTML = 'Game';
    map.innerHTML = 'Map';
    players.innerHTML = 'Players';
    address.innerHTML = 'Address';

    row.dataset.identifier = 'header_row';

    row.appendChild(name);
    row.appendChild(game);
    row.appendChild(map);
    row.appendChild(players);
    row.appendChild(address);
    table.appendChild(row);
    entry_div.appendChild(table);
  };

  var poll_server = function poll_server(server) {
    // console.log(`Polling server: ${server} at `, Date.now())
    var payload = { data: server };
    var promise = ajax.post(BASE_URL + '/all', payload);
    promise.then(function (response) {
      var parsed_response = JSON.parse(response);
      var server_info = parsed_response.data[server];
      update_row(server, server_info);
    });
  };

  var update_row = function update_row(server_id, server_info) {
    var table = entry_div.firstChild;

    var row = document.createElement('tr');
    var name = document.createElement('td');
    var game = document.createElement('td');
    var map = document.createElement('td');
    var players = document.createElement('td');
    var address = document.createElement('td');

    name.innerHTML = server_info.hostname;
    game.innerHTML = server_info.gamedesc;
    map.innerHTML = server_info.map;
    players.innerHTML = server_info.players.length + '/' + server_info.maxplayers;
    address.innerHTML = server_id;

    row.dataset.identifier = server_id;

    row.appendChild(name);
    row.appendChild(game);
    row.appendChild(map);
    row.appendChild(players);
    row.appendChild(address);

    var existing_row = get_row_by_server_id(table, server_id);

    if (existing_row) {
      table.replaceChild(row, existing_row);
    } else {
      // table.appendChild(row)
      insert_in_order(table, row);
    }
    setTimeout(function () {
      poll_server(server_id);
    }, TIMEOUT);
  };

  var set_servers = function set_servers(server_list) {
    servers = server_list;
    entry_div.innerHTML = '';
    initialize_table();
    servers.forEach(function (server) {
      poll_server(server);
    });
  };

  return {
    servers: set_servers
  };
}();

source_table.servers(servers);

},{"./ajax":1}]},{},[2]);
