# shinjuku

![logo](https://cloud.githubusercontent.com/assets/5355966/15680065/29a3a1ca-278f-11e6-8a85-7f0978d80d61.png)

Pattern Based Event Router for Javascript

## Concept

![detail](https://cloud.githubusercontent.com/assets/5355966/15680064/297a9c8a-278f-11e6-98a5-5b9ca8ad13b9.png)

- communicate with modules like Express's router
- one-way data flow

*This is just an idea, I have yet to use in production code*

## Example

### One-way data flow

```js
const shi = new Shinjuku

// up -> onUp -> down -> onDown

// observe current entry title
shi.on("update", "categories/2/entries/3/title", (cat_id, entry_id, title) => {
  navigationBar.title.text = title
})

// observe post events for all entries
shi.onUp("update", "categories/:cat_id/entries/:entry_id/title", (cat_id, entry_id, value) => {
  // modify data store and call serve() to call observers
  const entry = entryStore.find(cat_id, entry_id)
  entry.title = value
  shi.down("update", `categories/${cat_id}/entries/${entry_id}/title`, value)
})

// post update event will call listeners
shi.update("categories/2/entries/3/title", "Hello world")
```

### get(), resource()

```js
const shi = new Shinjuku

// GET -> RESOURCE

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

### `up(type, path, value)`

`up` will call callbacks registered by `onUp`

`update`, `create`, `remove` is syntax sugar to omit `type`

### `onUp(type, pattern, callback)`

observe `up` events for paths expressed in `pattern` 

### `down(type, path, value)`

`down` will call callbacks registered by `onDown`

### `onDown(pattern, callback)`

observe `down` events for paths expressed in `pattern`

### `resource(pattern, callback)`

add `callback` that returns the resource for the path expressed in `pattern`

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
