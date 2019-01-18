module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<input type="text" >',
        opts: {'input-req-label': false },
        output: 0
    },
    {
        desc: 'should do nothing with just a label',
        input: '<label>Just a label</label>',
        opts: {'input-req-label': true },
        output: 0
    },
    {
        desc: 'should do nothing with a label with a "for" attrib',
        input: '<label for="doesntmatter">Just a label</label>',
        opts: {'input-req-label': true },
        output: 0
    },
    {
        desc: 'should do nothing with just a label',
        input: '<label>Just a label</label>',
        opts: {'input-req-label': true },
        output: 0
    },
    {
        desc: 'should do nothing with just an input',
        input: '<input >',
        opts: {'input-req-label': true },
        output: 0
    },
    {
        desc: 'should do nothing with an input of the wrong type',
        input: '<input type="number" >',
        opts: {'input-req-label': true },
        output: 0
    },
    {
        desc: 'should return an error if the text input has no label parent and no id/name',
        input: '<input type="text" value="great" >',
        opts: {'input-req-label': true },
        output: 1
    },
    {
        desc: 'should return an error if the radio input has no label parent and no id/name',
        input: '<input type="radio" value="great" >',
        opts: {'input-req-label': true },
        output: 1
    },
    {
        desc: 'should pass if text input has a label parent anywhere up the DOM',
        input: '<div><label><p><div><input type="text" value="great" ></div></p></label></div>',
        opts: {'input-req-label': true },
        output: 0
    },
    {
        desc: 'should pass if radio input has a label parent anywhere up the DOM',
        input: '<div><label><p><div><input type="radio" value="great" ></div></p></label></div>',
        opts: {'input-req-label': true },
        output: 0
    },
    {
        desc: 'should fail if the text input has a name not matching the label for',
        input: '<div><label for="dinosaur">Label!</label></div><section><input type="text" name="romeo"></section> ',
        opts: {'input-req-label': true },
        output: 1
    },
    {
        desc: 'should pass if the text input has a name matching the label for',
        input: '<div><label for="dinosaur">Label!</label></div><section><input type="text" name="dinosaur"></section> ',
        opts: {'input-req-label': true },
        output: 0
    },
    {
        desc: 'should fail if the text input has an id not matching the label for',
        input: '<div><label for="dinosaur">Label!</label></div><section><input type="text" id="romeo"></section> ',
        opts: {'input-req-label': true },
        output: 1
    },
    {
        desc: 'should pass if the text input has an id matching the label for',
        input: '<div><label for="dinosaur">Label!</label></div><section><input type="text" id="dinosaur"></section> ',
        opts: {'input-req-label': true },
        output: 0
    },
    {
        desc: 'should fail if the radio input has a name matching the label for',
        input: '<div><label for="dinosaur">Label!</label></div><section><input type="radio" name="dinosaur"></section> ',
        opts: {'input-req-label': true },
        output: 1
    },
    {
        desc: 'should pass if the radio input has an id matching the label for',
        input: '<div><label for="dinosaur">Label!</label></div><section><input type="radio" id="dinosaur"></section> ',
        opts: {'input-req-label': true },
        output: 0
    }
];