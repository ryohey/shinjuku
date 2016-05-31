(function() {
  "use strict"

  function splitComponents(path) {
    return path.replace(/^\//, "").split("/")
  }

  class PathPattern {
    constructor(path) {
      this.path = path
      this.components = splitComponents(path)
    }

    // returns captured strings array(or empty array) if matched or returns null
    match(path) {
      const capture = []
      const target = splitComponents(path).reverse()
      for (const c of this.components) {
        const t = target.pop()
        if (c.startsWith(":")) {
          capture.push(t)
        } else if (c != t) {
          return null
        }
      }
      return capture
    }
  }

  function callMatched(listeners, type, path, value) {
    listeners.filter(l => l.type == type).forEach(l => {
      const match = l.pattern.match(path)
      if (match) {
        if (value) {
          match.push(value)
        }
        l.callback.apply(null, match)
      }
    })
  }

  class Observer {
    constructor() {
      this.listeners = []
    }

    on(type, pattern, callback) {
      this.listeners.push({
        type: type,
        pattern: new PathPattern(pattern),
        callback: callback
      })
    }

    off(type, pattern, callback) {
      this.listeners = this.listeners.filter(o => 
        o.type == type &&
        o.pattern == pattern &&
        o.callback == callback
      )
    }

    trigger(type, path, value) {
      callMatched(this.listeners, type, path, value)
    }
  }

  class Shinjuku {
    constructor() {
      this.resources = []
      this.upObserver = new Observer
      this.downObserver = new Observer
      this.on = this.onDown
    }

    resource(pattern, callback) {
      this.resources.push({
        pattern: new PathPattern(pattern),
        callback: callback
      })
    }

    get(path) {
      for (const r of this.resources) {
        const match = r.pattern.match(path)
        if (match) {
         return r.callback.apply(null, match)
        }
      }
    }

    onUp(type, pattern, callback) {
      this.upObserver.on(type, pattern, callback)
    }

    offUp(type, pattern, callback) {
      this.upObserver.off(type, pattern, callback)
    }

    up(type, path, value) {
      this.upObserver.trigger(type, path, value)
    }

    onDown(type, pattern, callback) {
      this.downObserver.on(type, pattern, callback)
    }

    offDown(type, pattern, callback) {
      this.downObserver.off(type, pattern, callback)
    }

    down(type, path, value) {
      this.downObserver.trigger(type, path, value)
    }

    // sugar

    create(path, value) {
      this.up("create", path, value)
    }

    update(path, value) {
      this.up("update", path, value)
    }

    remove(path, value) {
      this.up("remove", path, value)
    }
  }

  const root = 
    typeof global == "object" ? global :
    typeof self == "object" ? self : this
  root.Shinjuku = Shinjuku
})()