const path = require('path');

module.exports = () => (
    {
        mode: 'production',
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, './build'),
            filename: 'GlobalStorage.js',
            libraryTarget: 'umd',
            globalObject: 'this',
            library: 'GlobalStorage'
        },
        externals: {
			react: {
       			root: 'React',
        		commonjs2: 'react',
        		commonjs: 'react',
        		amd: 'react'
			}
        },
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: 'babel-loader'
                }
            ]
        },
    }
);
