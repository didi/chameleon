module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<figure></figure>',
        opts: { 'fig-req-figcaption': false },
        output: 0
    },
    {
        desc: 'should fail when no figcaption is present',
        input: '<figure></figure>',
        opts: { 'fig-req-figcaption': true },
        output: 1
    },
    {
        desc: 'should fail when a caption is not a child',
        input: '<figure><p>1</p><p>2</p><p>3</p><p>4</p></figure>',
        opts: { 'fig-req-figcaption': true },
        output: 1
    },
    {
        desc: 'should fail twice when a figcaption is a sibling',
        input: '<figure></figure><figcaption></figcaption>',
        opts: { 'fig-req-figcaption': true },
        output: 2
    },
    {
        desc: 'should continue checking after a pass',
        input: '<figure></figure><figure><figcaption></figcaption></figure><div><figcaption></figcaption></div>',
        opts: { 'fig-req-figcaption': true },
        output: 2
    },
    {
        desc: 'should pass even if it is the last child',
        input: '<figure><p>1</p><p>2</p><p>3</p><p>4</p><figcaption></figcaption></figure>',
        opts: { 'fig-req-figcaption': true },
        output: 0
    }
];
