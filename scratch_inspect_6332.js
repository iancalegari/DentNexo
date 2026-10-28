async function inspect6332() {
  const jsRes = await fetch('https://ttsforfree.com/_next/static/chunks/1462-b7460a15a1364710.js');
  const js = await jsRes.text();
  if (js.includes('6332:')) {
    const idx = js.indexOf('6332:');
    console.log(js.slice(idx, idx + 800));
  } else {
    // search in all scripts
    const htmlRes = await fetch('https://ttsforfree.com/?language=pt&voice=Authoritative+Advisor+2+Gemini+%28Brazilian+Portuguese%29');
    const html = await htmlRes.text();
    const scripts = html.match(/src="(\/_next\/static\/chunks\/[^"]+)"/g) || [];
    for (const s of scripts) {
      const src = s.replace('src="', '').replace('"', '');
      const jsUrl = 'https://ttsforfree.com' + src;
      const res = await fetch(jsUrl);
      const content = await res.text();
      if (content.includes('6332:')) {
        const idx = content.indexOf('6332:');
        console.log('Found in', jsUrl, ':', content.slice(idx, idx + 800));
        break;
      }
    }
  }
}
inspect6332();
