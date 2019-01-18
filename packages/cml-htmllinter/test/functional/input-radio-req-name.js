module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<input type="radio">',
        opts: { 'input-radio-req-name': false },
        output: 0
    },
    {
        desc: 'should pass when input has no type',
        input: '<input>',
        opts: { 'input-radio-req-name': true },
        output: 0
    },
    {
        desc: 'should pass when input has no type value',
        input: '<input type>',
        opts: { 'input-radio-req-name': true },
        output: 0
    },
    {
        desc: 'should pass when input has type text',
        input: '<input type="text">',
        opts: { 'input-radio-req-name': true },
        output: 0
    },
    {
        desc: 'should fail when radio input has no name',
        input: '<input type="radio" >',
        opts: { 'input-radio-req-name': true },
        output: 1
    },
    {
        desc: 'should fail when radio input has empty name',
        input: '<input type="radio" name>',
        opts: { 'input-radio-req-name': true },
        output: 1
    },
    {
        desc: 'should fail when radio input has name with no length',
        input: '<input type="radio" name="">',
        opts: { 'input-radio-req-name': true },
        output: 1
    },
    {
        desc: 'should pass when radio input has a name',
        input: '<input type="radio" name="hello">',
        opts: { 'input-radio-req-name': true },
        output: 0
    }
];