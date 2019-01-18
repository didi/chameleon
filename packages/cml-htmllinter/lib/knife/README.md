knife
=====

Put any utility functions in this directory. Each file should export an object
with functions like this:

```javascript
// lib/knife/some_util.js
module.exports = {
  some_util: function () {
    console.log('HELLO WORLD');
  },

  some_util2: function (msg) {
    console.log(msg);
  }
};
```

All of the files in this directory (excluding `index.js`) will have the functions
on their exports merged and then exported by `index.js`. You can then use knife in
other parts of the code base like so:

```javascript
// lib/some_file.js

var knife = require('./knife');

knife.dice(' some text ');
```

> NOTE: only functions will be copied from exports, variables will not be. Do not
> rely on the this context in your utility functions to have certain properties,
> etc.
