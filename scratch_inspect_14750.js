async function inspect14750() {
  const htmlRes = await fetch('https://ttsforfree.com/?language=pt&voice=Authoritative+Advisor+2+Gemini+%28Brazilian+Portuguese%29');
  const html = await htmlRes.text();
  const scripts = html.match(/src="(\/_next\/static\/chunks\/[^"]+)"/g) || [];
  for (const s of scripts) {
    const src = s.replace('src="', '').replace('"', '');
    const jsUrl = 'https://ttsforfree.com' + src;
    const jsRes = await fetch(jsUrl);
    const js = await jsRes.text();
    if (js.includes('14750:')) {
      const idx = js.indexOf('14750:');
      console.log('Found 14750 in', jsUrl, ':', js.slice(idx, idx + 400));
    }
  }
}
inspect14750();
