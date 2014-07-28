# DOM Event stream

[![browser support](https://ci.testling.com/bloodyowl/domevent-stream.png)
](https://ci.testling.com/bloodyowl/domevent-stream)

## install

```sh
$ npm install bloody-domeventstream
```

## require

```javascript
var DOMEventStream = require("bloody-domeventstream")
```

## api

### EventStream.createEventStreamAtNode(element, type[, capture=false]) => stream

creates an event stream that receives event objects when events are fired.

```javascript
var stream = require("bloody-stream")
var articleClickStream = EventStream.createEventStreamAtNode(
  document.getElementById("article"),
  "click"
)

articleClickStream.on("data", function(eventObject){
  console.log("event object :", eventObject)
})
```

### EventStream.removeEventStreamAtNode(element, type[, capture=false]) => didRemove (boolean)

stops listening the given event and ends the stream.
returns a boolean : `true` if there was a listener, `false` if not.

```javascript
DOMEventStream.removeEventStreamAtNode(
  document.getElementById("article"),
  "click"
)
```

### EventStream.filterBySelector(selector) => stream

utility returning a passthrough stream filtering the target by selector.

```javascript
articleClickStream
  .pipe(DOMEventStream.filterBySelector(".js-Button"))
  .on("data", function(eventObject){
    console.log(eventObject.delegatedTarget)
  })
```

### trigger an event

to trigger an event juste use the `write` method of the stream.

```javascript
articleClickStream.write({
  target : myTarget,
  pageY : 0,
  pageX : 0
})
```
