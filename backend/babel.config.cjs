// babel is only used by Jest: it removes the TypeScript types and converts the code into a form Jest can run.
module.exports = {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
    ],
};