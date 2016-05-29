(function() {
  class PathPattern {
    constructor(path) {

    }

    // returns captured strings array(or empty array) if matched or returns null
    match(path) {
      return null
    }
  }

  class Shinjuku {
    constructor() {
      this.resources = []
      this.observers = []
    }

    resource(pattern, callback) {
      this.resources.push({
        pattern: new PathPattern(pattern),
        callback: callback
      })
    }

    observe(type, pattern, callback) {
      this.observers.push({
        type: type,
        pattern: new PathPattern(pattern),
        callback: callback
      })
    }

    post(type, path, value) {
      this.observers
        .filter(o => o.type == type)
        .forEach(o => {
           const match = o.pattern.match(path)
           if (match) {
             o.callback.apply(null, match)
           }
        })
    }

    get(path) {
      for (r of this.resources) {
        const match = r.pattern.match(path)
        if (match) {
         return r.callback.apply(null, match)
        }
      }
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
  global.Shinjuku = Shinjuku
})()