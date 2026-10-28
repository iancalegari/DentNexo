async function inspectB() {
  const jsRes = await fetch('https://ttsforfree.com/_next/static/chunks/1462-b7460a15a1364710.js');
  const js = await jsRes.text();
  const idx = js.indexOf('6332:');
  console.log(js.slice(idx + 700, idx + 2500));
}
inspectB();
