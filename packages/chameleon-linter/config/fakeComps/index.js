const list = [{
  name: 'app',
  allowAttrs: {
    vars: ['store', 'routerConfig'],
    methods: [],
    props: [{
      name: 'store',
      required: true
    }, {
      name: 'routerConfig',
      required: true
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
