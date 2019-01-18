module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<!DOCTYPE HI MOM>',
        opts: { 'doctype-html5': false },
        output: 0
    }, {
        desc: 'should fail when given a html4 doctype',
        input: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"\n"http://www.w3.org/TR/html4/strict.dtd">',
        opts: { 'doctype-html5': true },
        output: 1
    }, {
        desc: 'should pass when given a non-obsolete non-legacy doctype',
        input: '<!DOCTYPE html><html></html>',
        opts: { 'doctype-html5': true },
        output: 0
    }, {
        desc: 'should fail when given a legacy doctype',
        input: '<!DOCTYPE html SYSTEM "about:legacy-compat">',
        opts: { 'doctype-html5': true },
        output: 1
    }, {
        desc: 'should pass a random directive',
        input: '<!random g>',
        opts: { 'doctype-html5': true },
        output: 0
    }
];
