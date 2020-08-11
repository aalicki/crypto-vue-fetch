## NOTE
This was a code challenge, meant to serve as an example of how to connect to an API, fetch some data, and return it in the view. Some of the methods presented are not the best practices. Given more time, I would have utilized things correctly (Promise listeners, better code structure, less tightly coupled methods, etc...)

### `.env.js`
Environment variables.

### `main.js`
Root app initialization file.

## Utils/Helpers

### Debounce
```
import debounce from '../directives/debounce'
directives: {
  debounce
}
```
Use it in a template.
```
<input type="text" v-model="name" v-debounce="500" @debounce-change="runSomeMethod">
```

## Build Setup
```
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run serve

# build for production with minification
npm run build
```
