"use strict"
const assert = require("assert")
const shinjuku = require("./shinjuku.js")

describe("shinjuku", () => {

  it("get resource for path", () => {
    const shi = new Shinjuku
    let called = false
    shi.resource("/a/b/c", () => {
      called = true
      return 31415
    })
    const res = shi.get("/a/b/c")
    assert(called)
    assert.equal(res, 31415)
  })

  it("get resource for pattern", () => {
    const shi = new Shinjuku
    let called = false
    shi.resource("/:first/b/:second", (first, second) => {
      called = true
      return [first, second]
    })
    const res = shi.get("/a/b/c")
    assert(called)
    assert.equal(res[0], "a")
    assert.equal(res[1], "c")
  })

  it("listen to post for path", () => {
    const shi = new Shinjuku
    let called = false
    shi.listen("update", "/a/b/c", (value) => {
      called = true
      assert.equal(value, "foobar")
    })
    const res = shi.post("update", "/a/b/c", "foobar")
    assert(called)
  })

  it("listen to post for pattern", () => {
    const shi = new Shinjuku
    let called = false
    shi.listen("update", "/a/:first/:second", (first, second, value) => {
      called = true
      assert.equal(first, "b")
      assert.equal(second, "c")
      assert.equal(value, "foobar")
    })
    const res = shi.post("update", "/a/b/c", "foobar")
    assert(called)
  })

  it("observe to serve for path", () => {
    const shi = new Shinjuku
    let called = false
    shi.observe("update", "/a/b/:id", (id, value) => {
      called = true
      assert.equal(id, "c")
      assert.equal(value, "foobar")
    })
    shi.serve("update", "/a/b/c", "foobar")
    assert(called)
  })
})
