# shinjuku

Pattern Based Dispatcher for Javascript

![data-flow](https://cloud.githubusercontent.com/assets/5355966/15634596/f50ed908-2602-11e6-8fc9-caed613bba40.png)

- communicate with modules like Express's router
- one-way data flow

*This is just an idea, I have yet to use in production code*

## Example

```js
const shi = new Shinjuku

// POST -> LISTEN -> SERVE -> OBSERVE

// observe all entry title
shi.observe("update", "categories/2/entries/3/title", (cat_id, entry_id, title) => {
  navigationBar.title.text = title
})

// observe post events for all entries
shi.listen("update", "categories/:cat_id/entries/:entry_id/title", (cat_id, entry_id, value) => {
  // modify data store and call serve() to call observers
  const entry = entryStore.find(cat_id, entry_id)
  entry.title = value
  shi.serve("update", `categories/${cat_id}/entries/${entry_id}/title`, value)
})

// post update event to change entry title
shi.update("categories/2/entries/3/title", "Hello world")

// provide data for request pattern
shi.resource("categories/:cat_id/entries/:entry_id", (cat_id, entry_id) => {
  return {
    entry_id: entry_id,
    cat_id: cat_id,
    title: "hello world",
    text: "this is an idea"
  }
})

// get the resource
const title = shi.get("categories/3/entries/0/title")
console.log(`Title is ${title}`)
```

## API

### `resource(pattern, callback)`

add `callback` that returns the resource for the path expressed in `pattern`

### `observe(pattern, callback)`

observe `serve` events for paths expressed in `pattern`

### `listen(type, pattern, callback)`

observe `post` events for paths expressed in `pattern` 

### `post(type, path, value)`

`post` will call callbacks registered by `listen`

`update`, `create`, `remove` is syntax sugar to omit `type`

### `serve(type, path, value)`

`serve` will call callbacks registered by `observe`

### `get(path)`

`get` will call the callback registered by `resource`

## Tips

And this may better than write templates repeatedly.

```js
shi.updateEntryTitle = (cat_id, entry_id, title) => {
  shi.update(`categories/{cat_id}/entries/{entry_id}/title`, title)
}
```

and

```
shi.updateEntryTitle(3, 12, "Hello world")
```
