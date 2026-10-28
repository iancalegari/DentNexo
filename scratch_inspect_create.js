async function inspectCreate() {
  const jsRes = await fetch('https://ttsforfree.com/_next/static/chunks/8215-62573aff9e9697ce.js');
  const js = await jsRes.text();
  const createIndex = js.indexOf('api/tts/create');
  console.log(js.slice(Math.max(0, createIndex - 300), Math.min(js.length, createIndex + 400)));
}
inspectCreate();
