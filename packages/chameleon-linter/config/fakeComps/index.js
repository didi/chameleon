const list = [{
  name: 'app',
  allowAttrs: {
    vars: ['store', 'routerConfig'],
    methods: [],
    props: [{
      name: 'store',
      required: false
    }, {
      name: 'routerConfig',
      required: false
    }],
    events: []
  }
}, {
  name: 'component',
  allowAttrs: {
    vars: ['is', 'shrinkcomponents'],
    methods: [],
    props: [{
      name: 'is',
      required: true
    }, {
      name: 'shrinkcomponents',
      required: false
    }],
    events: []
  }
}];

module.exports = list;
