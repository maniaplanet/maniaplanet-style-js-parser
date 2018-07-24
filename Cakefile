fs     = require 'fs'
{exec} = require 'child_process'
browserify  = require 'browserify'
coffeeify  = require 'coffeeify'

# Runs browserify
execute = ->
  # equal of command line $ "browserify  -t coffeeify ./src/Parser.coffee > bundle.js "
  b = browserify(debug: false, transform: coffeeify)
  b.add './src/BrowserModule.coffee'
  b.bundle (err, result) ->
    if not err
      fs.writeFile "docs/bin/mp-style-parser.js", result, (err) ->
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
