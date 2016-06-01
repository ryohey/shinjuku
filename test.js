"use strict"
const assert = require("assert")
const shinjuku = require("./shinjuku.js")

describe("shinjuku", () => {

  it("get resource for pattern", () => {
    const shi = new Shinjuku
    let called = false
    shi.resource("/:first/*/:second", (req) => {
      called = true
      return req
    })
    const res = shi.get("/a/b/c")
    assert(called)
    assert.equal(res.params.first, "a")
    assert.equal(res.params.second, "c")
  })

  it("observe up for pattern", () => {
    const shi = new Shinjuku
    let called = false
    shi.onUp("update", "/*/:first/:second", (req) => {
      called = true
      assert.equal(req.params.first, "b")
      assert.equal(req.params.second, "c")
      assert.equal(req.value, "foobar")
    })
    const res = shi.up("update", "/a/b/c", "foobar")
    assert(called)
  })

  it("observe down for pattern", () => {
    const shi = new Shinjuku
    let called = false
    shi.onDown("update", "/*/*/:id", (req) => {
      called = true
      assert.equal(req.params.id, "c")
      assert.equal(req.value, "foobar")
    })
    shi.down("update", "/a/b/c", "foobar")
    assert(called)
  })
})
