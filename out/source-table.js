!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var Ajax=function(){var get=function(url){return new Promise(function(resolve,reject){var request=new XMLHttpRequest;request.open("GET",url),request.onload=function(){200===request.status?resolve(request.response):reject(new Error(request.statusText))},request.onerror=function(){reject(new Error("Network error"))},request.send()})},post=function(url,data){return new Promise(function(resolve,reject){var request=new XMLHttpRequest;request.open("POST",url),request.setRequestHeader("Content-Type","application/json;charset=UTF-8"),request.onload=function(){200===request.status?resolve(request.response):reject(new Error(request.statusText))},request.onerror=function(){reject(new Error("Network error"))},request.send(JSON.stringify(data))})};return{get:get,post:post}}();exports["default"]=Ajax},{}],2:[function(require,module,exports){"use strict";var ajax=require("./ajax")["default"],source_table=function(){var BASE_URL="https://source.fap.no/api/v1",TIMEOUT=5e3,servers=[],entry_div=document.getElementById("source_table"),get_row_by_server_id=function(table,server_id){for(var i=0;i<table.children.length;i++){var child=table.children[i];if(child.dataset.identifier===server_id)return child}return null},insert_in_order=function(table,new_row){var new_name=new_row.children[0].innerHTML;if(console.log("insert"),1===table.children.length)return console.log("adding first child"),void table.appendChild(new_row);for(var i=1;i<table.children.length;i++){var current_row=table.children[i],current_name=current_row.children[0].innerHTML;if(current_name>new_name)return void table.insertBefore(new_row,current_row)}table.appendChild(new_row)},initialize_table=function(){var table=document.createElement("table"),row=document.createElement("tr"),name=document.createElement("th"),game=document.createElement("th"),map=document.createElement("th"),players=document.createElement("th"),address=document.createElement("th");name.innerHTML="Name",game.innerHTML="Game",map.innerHTML="Map",players.innerHTML="Players",address.innerHTML="Address",row.dataset.identifier="header_row",row.appendChild(name),row.appendChild(game),row.appendChild(map),row.appendChild(players),row.appendChild(address),table.appendChild(row),entry_div.appendChild(table)},poll_server=function(server){var payload={data:server},promise=ajax.post(BASE_URL+"/all",payload);promise.then(function(response){var parsed_response=JSON.parse(response),server_info=parsed_response.data[server];update_row(server,server_info)})},update_row=function(server_id,server_info){var table=entry_div.firstChild,row=document.createElement("tr"),name=document.createElement("td"),game=document.createElement("td"),map=document.createElement("td"),players=document.createElement("td"),address=document.createElement("td");name.innerHTML=server_info.hostname,game.innerHTML=server_info.gamedesc,map.innerHTML=server_info.map,players.innerHTML=server_info.players.length+"/"+server_info.maxplayers,address.innerHTML=server_id,row.dataset.identifier=server_id,row.appendChild(name),row.appendChild(game),row.appendChild(map),row.appendChild(players),row.appendChild(address);var existing_row=get_row_by_server_id(table,server_id);existing_row?table.replaceChild(row,existing_row):insert_in_order(table,row),setTimeout(function(){poll_server(server_id)},TIMEOUT)},set_servers=function(server_list){servers=server_list,entry_div.innerHTML="",initialize_table(),servers.forEach(function(server){poll_server(server)})};return{servers:set_servers}}();window.source_table=source_table},{"./ajax":1}]},{},[2]);
