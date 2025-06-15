module.exports = {
    entry: "./src/shim/browser.ts",
    output: {
        filename: "foxscheme.js",
        path: __dirname + "/dist",
        library: {
            name: 'FoxScheme',
            type: 'var',
            export: 'default'
        },
        globalObject: 'this'
    },
    mode: "development",

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"],
        // Ensure .js files are properly resolved
        mainFields: ["browser", "module", "main"]
    },

    externals: {
      repl: 'require("repl")'
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "babel-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    }
};
