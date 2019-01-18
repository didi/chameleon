module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<!DOCTYPE html>\n<html></html>',
        opts: { 'html-req-lang': false },
        output: 0
    }, {
        desc: 'should pass html with lang',
        input: '<!DOCTYPE html>\n<html lang="en"></html>',
        opts: { 'html-req-lang': true },
        output: 0
    }, {
        desc: 'should fail on html with no lang',
        input: '<!DOCTYPE html>\n<html></html>',
        opts: { 'html-req-lang': true },
        output: 1
    }, {
        desc: 'should fail on invalid lang if lang-style is true',
        input: '<!DOCTYPE html>\n<html lang="enus"></html>',
        opts: { 'lang-style': true },
        output: 1
    }, {
        desc: 'should pass on valid lang if lang-style is true',
        input: '<!DOCTYPE html>\n<html lang="en-US"></html>',
        opts: { 'lang-style': true },
        output: 0
    }, {
        desc: 'should allow empty lang tag',
        input: '<!DOCTYPE html>\n<html lang=""></html>',
        opts: { 'lang-style': true },
        output: 0
    }, {
        desc: 'should fail on wrong-case lang if lang-style is "case"',
        input: '<!DOCTYPE html>\n<html lang="en-us"></html>',
        opts: { 'lang-style': 'case' },
        output: 1
    }, {
        desc: 'should pass correct lang if lang-style is "case"',
        input: '<!DOCTYPE html>\n<html lang="en-US"></html>',
        opts: { 'lang-style': 'case' },
        output: 0
    }
];
