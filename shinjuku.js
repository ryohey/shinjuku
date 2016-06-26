(function() {
  "use strict"

  function normalizePath(path) {
    return path
      .replace(/\/\//, "/")
      .replace(/^\//, "")
      .replace(/\/$/, "")
  }

  function splitComponents(path) {
    return normalizePath(path)
      .split("/")
  }

  class PathPattern {
    constructor(path) {
      this.path = path
      this.components = splitComponents(path)
    }

    // returns captured strings array(or empty array) if matched or returns null
    match(path) {
      const capture = {}
      const target = splitComponents(path).reverse()
      for (const c of this.components) {
        const t = target.pop()
        if (c == "*") {
          continue
        } else if (c.startsWith(":")) {
          capture[c.substr(1)] = t
        } else if (c != t) {
          return null
        }
      }
      return capture
    }
  }

  function callMatched(listeners, type, path, value) {
    return listeners
      .filter(l => l.type == "*" || l.type == type)
      .map(l => {
        const match = l.pattern.match(path)
        if (match) {
          return l.callback({
            type: type,
            path: path,
            value: value,
            params: match
          })
        } else {
          return null
        }
      })
      .filter(r => r)[0]
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
      return callMatched(this.listeners, type, path, value)
    }
  }

  class Shinjuku {
    constructor(parent = null, basePath = "") {
      if (parent) {
        this.upObserver = parent.upObserver
        this.downObserver = parent.downObserver
        this.resourceObserver = parent.resourceObserver
      } else {
        this.upObserver = new Observer
        this.downObserver = new Observer
        this.resourceObserver = new Observer
      }

      this.basePath = basePath
      this.on = this.onDown
    }

    sub(basePath) {
      return new Shinjuku(this, basePath)
    }

    makePath(path) {
      return normalizePath(`${this.basePath}/${path}`)
    }

    resource(pattern, callback) {
      this.resourceObserver.on("res", this.makePath(pattern), callback)
    }

    get(path) {
      return this.resourceObserver.trigger("res", this.makePath(path))
    }

    onUp(type, pattern, callback) {
      this.upObserver.on(type, this.makePath(pattern), callback)
    }

    offUp(type, pattern, callback) {
      this.upObserver.off(type, this.makePath(pattern), callback)
    }

    up(type, path, value) {
      const aPath = this.makePath(path)
      const res = this.upObserver.trigger(type, aPath, value)
      if (res) {
        this.down(type, path, res)
      }
    }

    onDown(type, pattern, callback) {
      this.downObserver.on(type, this.makePath(pattern), callback)
    }

    offDown(type, pattern, callback) {
      this.downObserver.off(type, this.makePath(pattern), callback)
    }

    down(type, path, value) {
      this.downObserver.trigger(type, this.makePath(path), value)
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
