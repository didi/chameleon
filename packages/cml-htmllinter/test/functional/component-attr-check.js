module.exports = [
  {
      desc: 'should pass component-attr-check',
      input: '<template lang="cml"><component is="{{currentComp}}" style="comp"></component></template>',
      opts: { 
        'component-event-regex': /(?:c-bind:|c-catch:)(\w+)/,
        'component-prop-regex': false,
        'component-allow-attr': [{
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
        }]
      },
      output: 0
  },
  {
    desc: 'should not pass component-attr-check',
    input: '<template lang="cml"><component shrinkcomponents="comp,comp1"></component></template>',
    opts: { 
      'component-event-regex': /(?:c-bind:|c-catch:)(\w+)/,
      'component-prop-regex': false,
      'component-allow-attr': {
        component:{
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
      }
    },
    output: 1
  }  
];
