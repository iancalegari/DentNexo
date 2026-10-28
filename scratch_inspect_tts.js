async function inspect() {
  try {
    const htmlRes = await fetch('https://ttsforfree.com/?language=pt&voice=Authoritative+Advisor+2+Gemini+%28Brazilian+Portuguese%29');
    const html = await htmlRes.text();
    const scripts = html.match(/src="(\/_next\/static\/chunks\/[^"]+)"/g) || [];
    console.log('Found scripts:', scripts.length);
    for (const s of scripts) {
      const src = s.replace('src="', '').replace('"', '');
      const jsUrl = 'https://ttsforfree.com' + src;
      const jsRes = await fetch(jsUrl);
      const js = await jsRes.text();
      if (js.includes('Authoritative') || js.includes('generate') || js.includes('synthesize') || js.includes('Gemini')) {
        console.log('Script matches keywords:', jsUrl);
        const matches = js.match(/(https?:\/\/[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.\/]+|api\/[a-zA-Z0-9_\-\/]+)/g) || [];
        console.log('Matching endpoints:', matches.filter(m => m.includes('api') || m.includes('tts') || m.includes('voice')));
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}
inspect();
