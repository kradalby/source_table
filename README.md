# source-table

Display live stats from Source engine servers as a html table

## Usage
Inside the body, add the following:

    <div id="source_table"></div>
    <script src="https://raw.githubusercontent.com/kradalby/source_table/master/out/source-table.js"></script>
    <script>
    var servers = [
      '193.202.115.74:27115',
      '193.202.115.74:27117',
      '193.202.115.82:27119'
    ]

    source_table.servers(servers)
    </script>

The server list is on the format: IP:PORT and must be presented as a string.

Inside the div, a table is spawned, and it can be styled as a regular table with the specific div as a parent.
