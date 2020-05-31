# Vuefire test project

This project demonstrates some issues with Vuefire bindings.

We have `locations` and `buildings` collections. A location has a reference to a building. When updating the `locations` collection, Firestore triggers an update, automatically updating the Vue binding that we set up using Vuefire.

The watch on `this.locations` triggers twice:

1. The `building` field is string `buildings/<someId>`
2. The `building` field is object `{ name: 'Building 1' }`

Since I set `{ wait: true }` on the binding and in the Vuefire global settings I expect update 1 not to happen.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Serve built project locally with Firebase

```
firebase serve
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
