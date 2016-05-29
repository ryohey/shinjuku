# shinjuku

Pattern Based Dispatcher for Javascript

*This is just an idea, I have not implemented yet!*

## Example

```js
const shi = new Shinjuku

// provide data for request pattern
shi.resource("categories/:cat_id/entries/:entry_id", (cat_id, entry_id) => {
  return {
    entry_id: entry_id,
    cat_id: cat_id,
    title: "hello world",
    text: "this is an idea"
  }
})

// observe all entry title
shi.observe("update", "categories/:cat_id/entries/:entry_id/title", (cat_id, entry_id, title, oldTitle) => {
  // call when the title changed
})

// observe entries in the first category
shi.observe("update", "categories/0/entries/", (cat_id, entry_id, title, oldTitle) => {
  // call when the entry changed (including the title)
})

const title = shi.get("categories/3/entries/0/title")
console.log(`Title is ${title}`)

// update the entry title
shi.update("categories/0/entries/0/title", "Hello world")
```

## API

### `resource(pattern, callback)`

add `callback` that returns the resource for the path expressed in `pattern`

### `observe(pattern, callback)`

observe events for paths expressed in `pattern`

### `post(type, path, value)`

`post` will call callbacks registered by `observe`

`update`, `create`, `remove` is syntax sugar to omit `type`

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
