var tape = require("tape")
var DOMEventStream = require("..")

tape("createEventStreamAtNode", function(test){
  var button = document.createElement("button")
  var clickStream = DOMEventStream.createEventStreamAtNode(button, "click", false)

  document.body.appendChild(button)
  clickStream
    .on("data", function(eventObject){
      test.equal(eventObject.target, button)
      test.end()
      document.body.removeChild(button)
    })
  button.click()
})

tape("createEventStreamAtNode simulate click", function(test){
  var button = document.createElement("button")
  var clickStream = DOMEventStream.createEventStreamAtNode(button, "click", false)

  document.body.appendChild(button)
  clickStream
    .on("data", function(eventObject){
      test.equal(eventObject.target, button)
      test.end()
      document.body.removeChild(button)
    })
  clickStream.write({target:button})
})

tape("removeEventStreamAtNode", function(test){
  var button = document.createElement("button")
  var clickStream = DOMEventStream.createEventStreamAtNode(button, "click", false)
  var endCallbackExecutions = 0

  document.body.appendChild(button)
  clickStream
    .on("data", function(eventObject){
      test.equal(eventObject.target, button)
      DOMEventStream.removeEventStreamAtNode(button, "click", false)
    })
    .on("end", function(){
      ++endCallbackExecutions
      test.pass("triggers end")
      test.end()
      document.body.removeChild(button)
    })
  clickStream.write({target:button})
  setTimeout(function(){
    clickStream.write({target:button})
    test.equal(endCallbackExecutions, 1)
  }, 500)
})

tape("removeEventStreamAtNode stops listening to element", function(test){
  var button = document.createElement("button")
  var clickStream = DOMEventStream.createEventStreamAtNode(button, "click", false)
  var endCallbackExecutions = 0

  document.body.appendChild(button)
  clickStream
    .on("data", function(eventObject){
      test.equal(eventObject.target, button)
      DOMEventStream.removeEventStreamAtNode(button, "click", false)
    })
    .on("end", function(){
      ++endCallbackExecutions
      test.pass("triggers end")
      test.end()
      document.body.removeChild(button)
    })
  button.click()
  setTimeout(function(){
    button.click()
    test.equal(endCallbackExecutions, 1)
  }, 500)
})

tape("createEventStreamAtNode capture flag", function(test){
  var input = document.createElement("input")
  var focusStream = DOMEventStream.createEventStreamAtNode(document.body, "focus", true)
  var endCallbackExecutions = 0

  document.body.appendChild(input)
  focusStream
    .on("data", function(eventObject){
      test.equal(eventObject.target, input)
      DOMEventStream.removeEventStreamAtNode(document.body, "focus", true)
    })
    .on("end", function(){
      test.end()
      document.body.removeChild(input)
    })
  input.focus()
})

tape("filterBySelector", function(test){
  var button = document.createElement("button")
  var button2 = document.createElement("button")
  button.className = "yo"
  var clickStream = DOMEventStream.createEventStreamAtNode(document.body, "click", false)

  document.body.appendChild(button)
  document.body.appendChild(button2)

  clickStream
    .pipe(DOMEventStream.filterBySelector(".yo"))
    .on("data", function(eventObject){
      test.equal(eventObject.target, button)
      test.end()
      document.body.removeChild(button)
      document.body.removeChild(button2)
    })
  button2.click()
  button.click()
})
