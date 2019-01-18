module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<div id="2fOwj_0o-3"></div>',
        opts: { 'id-class-style': false },
        output: 0
    }, {
        desc: 'should fail when given an unknown option value',
        input: '',
        opts: { 'id-class-style': 'inconceivable' },
        output: 1
    }, {
        desc: 'should pass correctly styled id',
        input: '<div id="abc"></div>',
        opts: { 'id-class-style': 'lowercase' },
        output: 0
    }, {
        desc: 'should fail incorrectly styled id names',
        input: '<div id="foWj0wo3"></div>',
        opts: { 'id-class-style': 'lowercase' },
        output: 1
    }, {
        desc: 'should accept a "dash" option',
        input: '<div id="abc-def"></div>',
        opts: { 'id-class-style': 'dash' },
        output: 0
    }, {
        desc: 'should accept ids that use the BEM format',
        input: '<div id="block"></div><div id="block__element"></div><div id="block--modifier"></div><div id="block__element--modifier"></div><div id="poll-block"></div><div id="poll-block__element"></div><div id="poll-block__poll-element"></div><div id="poll-block--modifier"></div><div id="poll-block--poll-modifier"></div><div id="poll-block__element--modifier"></div><div id="poll-block__poll-element--modifier"></div><div id="poll-block__element--poll-modifier"></div><div id="poll-block__poll-element--poll-modifier"></div><div id="base-poll-block"></div><div id="base-poll-block__base-poll-element"></div><div id="base-poll-block__element--base-poll-modifier"></div><div id="base-poll-block__base-poll-element--base-poll-modifier"></div>',
        opts: {'id-class-style': 'bem'},
        output: 0
    }, {
        desc: 'should not accept ids that aren\'t compatible the BEM format',
        input: '<div id="block--modifier--modifier"></div><div id="block__element__element"></div>',
        opts: {'id-class-style': 'bem'},
        output: 2
    }, {
        desc: 'should accept a custom format RegExp',
        input: '<div id="-___"></div><div id="fail"></div><div class="_--_-">',
        opts: {'id-class-style': /^[-_]+$/},
        output: 1
    }, {
        desc: 'should ignore ids matching ignore regex',
        input: '<div id="doge{{l**i(tec/oin}}coin"></div>',
        opts: {'id-class-style': 'lowercase', 'id-class-ignore-regex': '{{.*?}}'},
        output: 0
    }
];
