module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<div id="ad-AD-ad-I\'m-an-ad" class="ad_thingy_that_advertises"></div>',
        opts: { 'id-class-no-ad': false },
        output: 0
    }, {
        desc: 'should pass id and class values not containing "ad"',
        input: '<div id="abc" class="fowj0wo3"></div>',
        opts: { 'id-class-no-ad': true },
        output: 0
    }, {
        desc: 'should pass id and class values containing "ad" but not as a word',
        input: '<div id="bad" class="sadness"></div>',
        opts: { 'id-class-no-ad': true },
        output: 0
    }, {
        desc: 'should fail id values containing "ad"',
        input: '<div id="qofwj_ad_ofqijoi"></div>',
        opts: { 'id-class-no-ad': true },
        output: 1
    }, {
        desc: 'should fail class values containing "ad"',
        input: '<div class="definitely-not-an-ad"></div>',
        opts: { 'id-class-no-ad': true },
        output: 1
    }, {
        desc: 'should fail values containing "banner" or "social"',
        input: '<div id="**banner**" class="~~social~~"></div>',
        opts: { 'id-class-no-ad': true },
        output: 2
    }
];
