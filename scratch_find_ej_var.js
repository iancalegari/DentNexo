async function findEjVar() {
  const jsRes = await fetch('https://ttsforfree.com/_next/static/chunks/8215-62573aff9e9697ce.js');
  const js = await jsRes.text();
  const index = js.indexOf('api/tts/create');
  const chunk = js.slice(index - 10000, index);
  const regex = /\b([a-zA-Z0-9_$]+)=([^,;]+)/g;
  let m;
  while ((m = regex.exec(chunk)) !== null) {
    if (m[1] === 'ej') {
      console.log('Found ej:', m[0]);
    }
  }
}
findEjVar();
