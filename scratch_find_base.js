async function findBaseUrl() {
  const jsRes = await fetch('https://ttsforfree.com/_next/static/chunks/8215-62573aff9e9697ce.js');
  const js = await jsRes.text();
  const index = js.indexOf('api/tts/create');
  // find ej definition
  const chunk = js.slice(Math.max(0, index - 2000), index);
  const ejMatches = chunk.match(/[a-zA-Z0-9_$]+="https?:\/\/[^"]+"/g) || [];
  console.log('Base URLs:', ejMatches);
  const envMatches = chunk.match(/process\.env\.[a-zA-Z0-9_]+/g) || [];
  console.log('Env matches:', envMatches);
}
findBaseUrl();
