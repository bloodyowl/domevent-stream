var stream = require("bloody-stream")
var matches = require("bloody-matches")

var eventStream = stream.extend({
  listener : function(eventObject){
    return this.write(eventObject)
  }
})

var PROPERTY_NAME = "__DOMEventStream__"

module.exports = {
  createEventStreamAtNode : function(element, type, capture){
    var reader
    if(element[PROPERTY_NAME] && element[PROPERTY_NAME][type]) {
      return element[PROPERTY_NAME][type]
    }
    if(!element[PROPERTY_NAME]) {
      element[PROPERTY_NAME] = {}
    }
    reader = eventStream.create()
    element[PROPERTY_NAME][type] = reader
    element.addEventListener(
      type,
      reader.accessor("listener"),
      !!(capture)
    )
    return reader
  },
  removeEventStreamAtNode : function(element, type, capture){
    var reader
    if(!element[PROPERTY_NAME] || !element[PROPERTY_NAME][type]) {
      return false
    }
    reader = element[PROPERTY_NAME][type]
    element.removeEventListener(
      type,
      reader.accessor("listener"),
      !!(capture)
    )
    reader.end()
    return true
  },
  filterBySelector : function(selector){
    var fn = function(eventObject){
      var target = eventObject.target
      do {
        if(matches(selector, target)) {
          eventObject.delegatedTarget = target
          this.queue(eventObject)
        }
      } while(
        (target = target.parentNode) &&
        (target != document)
      )
    }
    return stream.create(fn)
  }
}
