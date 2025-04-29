// commitlint.config.js
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'build',
                'chore',
                'ci',
                'docs',
                'feat',
                'feature',
                'fix',
                'perf',
                'refactor',
                'revert',
                'style',
                'test' // If you need to add another rule just ask med aziz guennichi for it.
            ]
        ],
    },
};
