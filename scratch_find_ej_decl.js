async function findEjDecl() {
  const jsRes = await fetch('https://ttsforfree.com/_next/static/chunks/8215-62573aff9e9697ce.js');
  const js = await jsRes.text();
  const index = js.indexOf('api/tts/create');
  const chunk = js.slice(index - 5000, index);
  const match = chunk.match(/ej\s*=\s*[^,;]+/);
  console.log('ej declaration:', match);
}
findEjDecl();
