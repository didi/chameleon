module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<section><div><p>Hello</p><p>World</p></div></section>',
        opts: { 'doctype-first': false },
        output: 0
    }, {
        desc: 'should pass when set to any falsy value',
        input: '<!DOCTYPE><div><p>Hello</p><p>World</p></div>',
        opts: { 'doctype-first': 0 },
        output: 0
    }, {
        desc: 'should pass when !DOCTYPE is first',
        input: '<!DOCTYPE><div><p>Hello</p><p>World</p></div>',
        opts: { 'doctype-first': true },
        output: 0
    }, {
        desc: 'should pass case-insensitive !DOCTYPE',
        input: '<!DoCtYpE><div><p>Hello</p><p>World</p></div>',
        opts: { 'doctype-first': true },
        output: 0
    }, {
        desc: 'should fail when !DOCTYPE is not present',
        input: '<section><div><p>Hello</p><p>World</p></div></section>',
        opts: { 'doctype-first': true },
        output: 1
    }, {
        desc: 'should fail when !DOCTYPE is not first',
        input: '<section><!DOCTYPE html><div><p>Hello</p><p>World</p></div></section>',
        opts: { 'doctype-first': true },
        output: 1
    }, {
        desc: 'should pass when multiple !DOCTYPEs are present, as long as a !DOCTYPE is first',
        input: '<!DOCTYPE><section><!DOCTYPE><div><p>Hello</p><p>World</p></div></section>',
        opts: { 'doctype-first': true },
        output: 0
    }, {
        desc: 'should pass in smart mode when !DOCTYPE and head are not present',
        input: '<section><div><p>Hello</p><p>World</p></div></section>',
        opts: { 'doctype-first': 'smart' },
        output: 0
    }, {
        desc: 'should fail in smart mode when !DOCTYPE is not present but head is',
        input: '<head></head><section><div><p>Hello</p><p>World</p></div></section>',
        opts: { 'doctype-first': 'smart' },
        output: 1
    }, {
        desc: 'should fail but not crash when first element is not a tag',
        input: 'foobar',
        opts: { 'doctype-first': true },
        output: 1
    }
];
