// console.log();
const fs = require('fs');
require('@vercel/ncc')(__dirname+'/src/index.ts', {
    // provide a custom cache path or disable caching
    cache: false,
    // externals to leave as requires of the build
    // externals: ["externalpackage"],
    // directory outside of which never to emit assets
    filterAssetBase: process.cwd(), // default
    minify: true, // default
    sourceMap: false, // default
    sourceMapBasePrefix: '../', // default treats sources as output-relative
    // when outputting a sourcemap, automatically include
    // source-map-support in the output file (increases output by 32kB).
    sourceMapRegister: false, // default
    watch: false, // default
    v8cache: false, // default
    quiet: false, // default
    debugLog: false // default
  }).then(async ({ code, map, assets }) => {
    const myDir = __dirname+'/dist';
    fs.access(myDir,(err)=>{
      if (err && err.code === 'ENOENT') {
        fs.mkdir(myDir,()=>{}); //Create dir in case not found
      }
      fs.writeFile(myDir+'/index.pro.js',code);
    })
    
    // Assets is an object of asset file names to { source, permissions, symlinks }
    // expected relative to the output code (if any)
  })