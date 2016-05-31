"use strict"
const assert = require("assert")
const shinjuku = require("./shinjuku.js")

describe("shinjuku", () => {

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

  it("observe up for pattern", () => {
    const shi = new Shinjuku
    let called = false
    shi.onUp("update", "/a/:first/:second", (first, second, value) => {
      called = true
      assert.equal(first, "b")
      assert.equal(second, "c")
      assert.equal(value, "foobar")
    })
    const res = shi.up("update", "/a/b/c", "foobar")
    assert(called)
  })

  it("observe down for pattern", () => {
    const shi = new Shinjuku
    let called = false
    shi.onDown("update", "/a/b/:id", (id, value) => {
      called = true
      assert.equal(id, "c")
      assert.equal(value, "foobar")
    })
    shi.down("update", "/a/b/c", "foobar")
    assert(called)
  })
})
