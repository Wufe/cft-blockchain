const path = require('path');
const xdmLoader = require('xdm/webpack.cjs');
const glob = require('glob');

const assoc = (key, value, object) => {
    object[key] = value
    return object
}

const entryName = path => path
    .split('/')
    .pop()
    .split('.')
    .shift()

const patternToEntries = entryNameFn => pattern => glob
    .sync(pattern)
    .map(path => [`mdx-slide-${entryNameFn(path)}`, path])
    .reduce((object, [key, value]) => assoc(key, value, object), {})

const entry = (...patterns) => {
    if (!['string', 'function'].includes(typeof patterns[0])) {
        throw new TypeError('First parameter of entry must be String or Function')
    }

    return patterns
        .map(patternToEntries(
            typeof patterns[0] === 'string' ? entryName : patterns.shift()
        ))
        .reduce((a, b) => {console.log(b);return Object.assign(a, b);}, {})
}

entry.basePath = (basePath = '.', ext = null) => fullPath => {
    const relativePath = relative(basePath, fullPath)
    const relativeDirName = dirname(relativePath)

    const directory = relativeDirName === '.' ? '' : `${relativeDirName}/`

    const fileName = ext ? basename(fullPath, ext) : entryName(fullPath)

    return directory + fileName
}

module.exports = {
    mode: 'development',
    entry: entry('./slides/*.mdx'),
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.mdx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'xdm/webpack.cjs'
                }
            }
        ],
    },
    target: 'web',
    resolve: {
        extensions: ['.js', '.xdm'],
        // alias: {
        //     'react$': 'node_modules/react/umd/react.production.min.js'
        // },
    },
    // externals: {'react/jsx-runtime': 'asd'},
    output: {
        filename: '[name].js',
        iife: true,
        library: {
            name: '[name]',
            type: 'var',
            export: 'default'
        },
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'slides', 'mdx-build'),
    }
};