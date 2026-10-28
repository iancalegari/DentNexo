async function findEj() {
  const jsRes = await fetch('https://ttsforfree.com/_next/static/chunks/8215-62573aff9e9697ce.js');
  const js = await jsRes.text();
  const index = js.indexOf('api/tts/create');
  console.log(js.slice(index - 1000, index + 200));
}
findEj();
