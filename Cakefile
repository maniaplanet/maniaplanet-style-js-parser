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
  ]
}

task 'build', 'Build applications discribred in javascripts var', ->
  for javascript, sources of javascripts
    appContents = new Array remaining = sources.length
    for source, index in sources then do (source, index) ->
      fs.readFile "src/#{source}.coffee", 'utf8', (err, fileContents) ->
        throw err if err
        appContents[index] = fileContents
        process() if --remaining is 0
    process = ->
      fs.writeFile 'bin/' + javascript + '.coffee', appContents.join('\n\n'), 'utf8', (err) ->
        throw err if err
        exec 'coffee --compile bin/' + javascript + '.coffee', (err, stdout, stderr) ->
          throw err if err
          console.log stdout + stderr
          fs.unlink 'bin/' + javascript + '.coffee', (err) ->
            throw err if err
            console.log 'Done.'