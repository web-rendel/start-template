// rollup.config.js
import uglify from "rollup-plugin-uglify";
import sass from "rollup-plugin-sass";
import pug from 'rollup-plugin-pug';


export default {
    // entry: "src/index.js",
    entry: 'src/js/common.js',
    // dest: "dist/js/common.js",
    // format: 'iife',
    // sourceMap: 'inline',
        // plugins: [
        //     sass({
        //         output: 'bundle.css',
        //     }),
        //     pug({
        //         include: 'src/pug/*.pug',
        //     })
        // ]
    external: [
        'pug',
        'path',
        'rollup-pluginutils'
        ]
};