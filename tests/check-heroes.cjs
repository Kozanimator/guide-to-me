const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('heroes.js', 'utf8');
// Fixture uses the field names and string ratings documented by SuperHeroAPI.
const batman = {
    response: 'success', id: '70', name: 'Batman',
    biography: {'full-name':'Bruce Wayne','first-appearance':'Detective Comics #27','place-of-birth':'Gotham County',publisher:'DC Comics'},
    powerstats: {strength:'26',speed:'27',intelligence:'100'},
    image: {url:'https://www.superherodb.com/pictures2/portraits/10/100/639.jpg'}
};
const ids = [...fs.readFileSync('heroes.html', 'utf8').matchAll(/id="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'HTML IDs are unique');

function setup(fetchImpl) {
    const elements = Object.fromEntries(ids.map(id => [id, {
        textContent: '', hidden: false, disabled: false, attributes: {}, handlers: {},
        classList: {add() {}, remove() {}},
        setAttribute(name, value) {this.attributes[name] = value;},
        removeAttribute(name) {delete this.attributes[name];},
        addEventListener(name, handler) {this.handlers[name] = handler;}
    }]));
    const select = elements['hero-select'];
    select.options = [...fs.readFileSync('heroes.html', 'utf8').matchAll(/<option value="(\d+)">([^<]+)<\/option>/g)].map(m => ({value: m[1], textContent: m[2]}));
    select.selectedIndex = 0;
    Object.defineProperty(select, 'value', {get() {return this.options[this.selectedIndex].value;}});
    Object.defineProperty(select, 'selectedOptions', {get() {return [this.options[this.selectedIndex]];}});
    let timeoutCallback;
    const context = vm.createContext({
        document: {getElementById: id => {assert.ok(elements[id], 'DOM element exists: '+id); return elements[id];}},
        fetch: fetchImpl, AbortController, console: {error() {}},
        setTimeout(fn, delay) {assert.equal(delay, 15000); timeoutCallback = fn; return 1;},
        clearTimeout() {}
    });
    vm.runInContext(source.replace(/\/\/ Open the first file when the page is ready\.\nloadHero\(\);\s*$/, ''), context);
    return {elements, context, run: () => context.loadHero(), timeout: () => timeoutCallback()};
}

function restored(t) {
    for (const id of ['hero-select','open-hero','random-hero']) assert.equal(t.elements[id].disabled, false);
    assert.equal(t.elements['hero-results'].attributes['aria-busy'], 'false');
}

(async () => {
    let url;
    let t = setup(async requested => {url = requested; return {ok:true,json:async()=>batman};});
    await t.run();
    assert.equal(url, '/api/hero/70');
    assert.equal(t.elements['hero-name'].textContent, 'Batman');
    assert.equal(t.elements['hero-identity'].textContent, 'Bruce Wayne');
    assert.equal(t.elements['strength-value'].textContent, '26 / 100');
    assert.equal(t.elements['hero-card'].hidden, false);
    assert.equal(t.elements['hero-image'].src, batman.image.url);
    t.elements['hero-image'].onload();
    assert.equal(t.elements['hero-image'].hidden, false);
    t.elements['hero-image'].onerror();
    assert.equal(t.elements['hero-image'].hidden, true);
    assert.match(t.elements['image-fallback'].textContent, /Portrait unavailable/);
    restored(t);
    console.log('PASS: successful request, JSON, DOM data, image load and image fallback');

    let preventDefault = false;
    t.elements['hero-form'].handlers.submit({preventDefault(){preventDefault=true;}});
    await new Promise(setImmediate);
    assert.ok(preventDefault);
    for(let i=0;i<10;i++) {
        const before=t.elements['hero-select'].selectedIndex;
        t.elements['random-hero'].handlers.click();
        await new Promise(setImmediate);
        assert.notEqual(t.elements['hero-select'].selectedIndex,before);
    }
    console.log('PASS: form submission and Surprise Me always changes selection');

    for (const [name, fetchImpl] of [
        ['API error in HTTP 200', async()=>({ok:true,json:async()=>({response:'error',error:'invalid id'})})],
        ['HTTP 404', async()=>({ok:false,status:404})],
        ['network failure', async()=>{throw new TypeError('Failed to fetch');}],
        ['invalid JSON', async()=>({ok:true,json:async()=>{throw new SyntaxError('Invalid JSON');}})],
        ['missing fields', async()=>({ok:true,json:async()=>({name:'Batman'})})]
    ]) {
        t=setup(fetchImpl); await t.run();
        assert.equal(t.elements['hero-card'].hidden,true);
        assert.match(t.elements['hero-status'].textContent,/Couldn't open/);
        restored(t); console.log('PASS: '+name+' gives feedback and permits retry');
    }

    const incomplete={name:'Example',biography:{publisher:'An alter ego'},powerstats:{strength:'0',speed:null,intelligence:'null'}};
    t=setup(async()=>({ok:true,json:async()=>incomplete})); await t.run();
    assert.equal(t.elements['hero-identity'].textContent,'Not listed');
    assert.equal(t.elements['hero-publisher'].textContent,'Publisher not listed');
    assert.equal(t.elements['strength-value'].textContent,'0 / 100');
    assert.equal(t.elements['speed-meter'].hidden,true);
    assert.equal(t.elements['intelligence-meter'].hidden,true);
    assert.match(t.elements['image-fallback'].textContent,/Portrait unavailable/);
    console.log('PASS: missing optional data, zero rating, null ratings, missing portrait');
    for(const value of ['', ' ', 'null', null, undefined, -1, 101, 'oops', {}, []]) {
        t.context.displayStat('strength',value);
        assert.equal(t.elements['strength-meter'].hidden,true,'invalid rating: '+JSON.stringify(value));
    }
    console.log('PASS: blank and invalid ratings never become a misleading zero');

    t=setup((url, options)=>new Promise((resolve,reject)=>{
        options.signal.addEventListener('abort',()=>reject(Object.assign(new Error('Aborted'),{name:'AbortError'})));
    }));
    const pending=t.run();
    assert.equal(t.elements['open-hero'].disabled,true);
    assert.equal(t.elements['hero-results'].attributes['aria-busy'],'true');
    assert.match(t.elements['hero-status'].textContent,/Opening Batman/);
    t.timeout(); await pending;
    assert.match(t.elements['hero-status'].textContent,/took too long/);
    restored(t);
    console.log('PASS: loading state, timeout, and restored controls');
})().catch(error=>{console.error(error);process.exitCode=1;});
