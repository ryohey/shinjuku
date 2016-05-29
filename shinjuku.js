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

  function callMatched(observers, type, path, value) {
    observers.filter(o => o.type == type).forEach(o => {
      const match = o.pattern.match(path)
      if (match) {
        if (value) {
          match.push(value)
        }
        o.callback.apply(null, match)
      }
    })
  }

  class Shinjuku {
    constructor() {
      this.resources = []
      this.observers = []
      this.listeners = []
    }

    // resource -> get

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

    // listen -> serve

    listen(type, pattern, callback) {
      this.listeners.push({
        type: type,
        pattern: new PathPattern(pattern),
        callback: callback
      })
    }

    serve(type, path, value) {
      callMatched(this.observers, type, path, value)
    }

    // observe -> get

    observe(type, pattern, callback) {
      this.observers.push({
        type: type,
        pattern: new PathPattern(pattern),
        callback: callback
      })
    }

    post(type, path, value) {
      callMatched(this.listeners, type, path, value)
    }

    create(path, value) {
      this.post("create", path, value)
    }

    update(path, value) {
      this.post("update", path, value)
    }

    remove(path, value) {
      this.post("remove", path, value)
    }
  }
  const root = 
    typeof global == "object" ? global :
    typeof self == "object" ? self : this
  root.Shinjuku = Shinjuku
})()