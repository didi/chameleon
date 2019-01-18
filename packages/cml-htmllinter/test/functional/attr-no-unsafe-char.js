module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<div prop1="qwo\u0000foqej" prop2="jf\u2013"></div>',
        opts: { 'attr-no-unsafe-char': false },
        output: 0
    }, {
        desc: 'should pass safe attribute values',
        input: '<div prop1="qwo\u0040foqej" prop2="jf\u2033"></div>',
        opts: { 'attr-no-unsafe-char': true },
        output: 0
    }, {
        desc: 'should fail unsafe attribute values',
        input: '<div prop1="qwofoqej" prop2="jf\u070f"></div>',
        opts: { 'attr-no-unsafe-char': true },
        output: 1
    }, {
        desc: 'should allow LF and CR in attribute values',
        input: '<div prop1="qwo\n0040foqej" prop2="jf\r2033"></div>',
        opts: { 'attr-no-unsafe-char': true },
        output: 0
    }
];
