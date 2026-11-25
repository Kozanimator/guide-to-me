import assert from 'node:assert/strict';
import worker from '../api/hero-worker.mjs';

const env = { SUPERHERO_API_TOKEN: 'test-only-placeholder' };
const request = (path = '/api/hero/70', options = {}) => new Request('https://proxy.example' + path, options);
const fixture = {
    response: 'success', name: 'Batman',
    biography: { 'full-name': 'Bruce Wayne', publisher: 'DC Comics' },
    powerstats: { strength: '26', speed: '27', intelligence: '100' },
    image: { url: 'https://www.superherodb.com/test.jpg' },
    unused: 'must not be passed to browser'
};
const originalFetch = globalThis.fetch;
let calls = 0;
try {
    globalThis.fetch = async (url, options) => {
        calls++;
        assert.equal(url, 'https://superheroapi.com/api/test-only-placeholder/70');
        assert.equal(options.redirect, 'error');
        return Response.json(fixture);
    };
    let response = await worker.fetch(request(), env);
    const body = await response.text();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://kozanimator.github.io');
    assert.equal(JSON.parse(body).biography['full-name'], 'Bruce Wayne');
    assert.equal(JSON.parse(body).powerstats.strength, '26');
    assert.ok(!body.includes(env.SUPERHERO_API_TOKEN));
    assert.ok(!body.includes('unused'));
    await worker.fetch(request(), env);
    assert.equal(calls, 1);
    console.log('PASS: correct upstream endpoint, safe field subset, CORS, private token and cached success');

    for (const [req, expected] of [
        [request('/api/hero/1'), 404],
        [request('/api/hero/70?url=https://unrelated.example'), 404],
        [request('/anything'), 404],
        [request('/api/hero/70', {method:'POST'}), 405],
        [request('/api/hero/70', {headers:{Origin:'https://unrelated.example'}}), 403],
        [request('/api/hero/70', {method:'OPTIONS',headers:{Origin:'https://kozanimator.github.io'}}), 204]
    ]) {
        response = await worker.fetch(req, env);
        assert.equal(response.status, expected);
    }
    assert.equal(calls, 1, 'invalid requests never reach the provider');
    response = await worker.fetch(request(), {});
    assert.equal(response.status, 503);
    console.log('PASS: supported IDs only, fixed routes, rejected query injection and methods, missing setup');

    for (const implementation of [
        async () => new Response('provider unavailable', {status:500}),
        async () => Response.json({response:'error',error:env.SUPERHERO_API_TOKEN}),
        async () => new Response('not json'),
        async () => { throw new Error('failed secret URL ' + env.SUPERHERO_API_TOKEN); },
        async () => Response.json({response:'success',name:'Incomplete'})
    ]) {
        globalThis.fetch = implementation;
        response = await worker.fetch(request('/api/hero/106'), env);
        assert.equal(response.status, 502);
        assert.equal(response.headers.get('Cache-Control'), 'no-store');
        assert.ok(!(await response.text()).includes(env.SUPERHERO_API_TOKEN));
    }
    console.log('PASS: HTTP errors, API errors, bad JSON, transport errors, and incomplete data return safe messages');
} finally {
    globalThis.fetch = originalFetch;
}
