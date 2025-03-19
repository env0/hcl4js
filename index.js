const fs = require('node:fs/promises');
const path = require('node:path');
const { gunzip } = require('node:zlib');
const { promisify } = require('node:util');
const do_gunzip = promisify(gunzip);

function relativePath(dir) {
    return path.join(__dirname, dir);
}

async function initHLC4JS() {

    if (!global.env0_hcl4js) {
        require(relativePath('wasm_exec.js'));
        const go = new global.Go();
        const gz = await fs.readFile(relativePath('main.wasm.gz'));
        const bytes = await do_gunzip(gz);
        const wasm = await WebAssembly.instantiate(bytes, go.importObject);

        // noinspection ES6MissingAwait - go main function doesn't exit
        go.run(wasm.instance);
    }


    return global.env0_hcl4js;
}

async function parse(filename, content) {
    const hcljs = await initHLC4JS();
    return hcljs.parse(filename, content);
}

module.exports = {parse}