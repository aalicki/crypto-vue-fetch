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
