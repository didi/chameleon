module.exports = [
    {
        desc: 'should pass when set to false',
        input: '<img />',
        opts: {
            'tag-req-attr': false
        },
        output: 0
    },
    {
        desc: 'should pass when set to empty object',
        input: '<img />',
        opts: {
            'tag-req-attr': {}
        },
        output: 0
    }, {
        desc: 'should pass when tag has correct attributes set',
        input: '<img src="nyan.mrw" alt="nyan" />',
        opts: {
            'tag-req-attr': {
                'img': [
                    {
                        'name': 'src'
                    },
                    {
                        'name': 'alt'
                    }
                ]
            }
        },
        output: 0
    }, {
        desc: 'should fail when tag has no correct attributes set',
        input: '<img id="notasource" />',
        opts: {
            'tag-req-attr': {
                'img': [
                    {
                        'name': 'src'
                    }
                ]
            }
        },
        output: 1
    }, {
        desc: 'should fail when tag has no correct attributes set',
        input: '<img id="notasource" />',
        opts: {
            'tag-req-attr': {
                'img': [
                    {
                        'name': 'src',
                        'allowEmpty': false
                    }
                ]
            }
        },
        output: 1
    }, {
        desc: 'should fail when tag attribute is empty',
        input: '<img src />',
        opts: {
            'tag-req-attr': {
                'img': [
                    {
                        'name': 'src'
                    }
                ]
            }
        },
        output: 1
    }, {
        desc: 'should pass when tag has correct attributes set',
        input: '<img src="nyan.mrw" alt="" />',
        opts: {
            'tag-req-attr': {
                'img': [
                    {
                        'name': 'src'
                    },
                    {
                        'name': 'alt',
                        'allowEmpty': true
                    }
                ]
            }
        },
        output: 0
    }, {
        desc: 'should pass when there is no configuration for the tag',
        input: '<img src="nyan.mrw" alt="" />',
        opts: {
            'tag-req-attr': {
                'input': [
                    {
                        'name': 'type'
                    }
                ]
            }
        },
        output: 0
    }
];
