fs     = require 'fs'
{exec} = require 'child_process'

javascripts = {
  'mp-style-parser' : [
    'Header',
    'Color',
    'Style',
    'Token',
    'LinkToken',
    'LinkTokenEnd',
    'Parser'
  ],
  'mp-style-parser-plugin' : [
    'Header',
    'Plugin'
  ]
}

task 'build', 'Build applications discribred in javascripts var', ->
  try
    fs.mkdirSync 'bin'
  catch err
    #do nothing
  for javascript, sources of javascripts
    appContents = new Array
    console.log 'Processing ' + javascript
    for source, index in sources then do (source, index) ->
      console.log '  `- ' + source
      appContents[index] = fs.readFileSync "src/#{source}.coffee", 'utf8'
    file = 'bin/' + javascript + '.coffee'
    console.log 'writing coffee file:' + file
    fs.writeFileSync file, appContents.join('\n\n'), 'utf8', (err) ->
      throw err if err
      console.log 'Compiling ' + javascript
    compileAndDelete javascript
    
compileAndDelete = (javascript) ->
  exec 'coffee --compile bin/' + javascript + '.coffee', (err, stdout, stderr) ->
    console.log stdout + stderr
    throw err if err
    fs.unlink 'bin/' + javascript + '.coffee', (err) ->
      throw err if err
      console.log 'Done.'