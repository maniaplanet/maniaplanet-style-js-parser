fs     = require 'fs'
{exec} = require 'child_process'
browserify  = require 'browserify'
coffeeify  = require 'coffeeify'

# Runs browserify
execute = ->
  # equal of command line $ "browserify --debug -t coffeeify ./src/main.coffee > bundle.js "
  b = browserify()
  b.add './src/main.coffee'
  b.transform coffeeify
  b.bundle
    debug: true
    transform: coffeeify
  , (err, result) ->
    if not err
      fs.writeFile "example/bundle.js", result, (err) ->
        if not err
          console.log "✔ browserify complete"
        else
          console.error "browserify failed: " + err
    else
      console.error "failed " + err

task 'browserify', 'Browserify', (options) ->
  execute()

# `title` Notification title
# `message` Notification message
notify = (title, message) ->
  console.log "#{title}: #{message}"
  growl message, {title:title}
	  
task 'test', 'Run tests', ->
  exec 'mocha --compilers coffee:coffee-script/register'