async function inspect23746() {
  const jsRes = await fetch('https://ttsforfree.com/_next/static/chunks/1462-b7460a15a1364710.js');
  const js = await jsRes.text();
  const idx = js.indexOf('23746:');
  console.log(js.slice(idx, idx + 1200));
}
inspect23746();
