async function testApi() {
  try {
    const res = await fetch('https://api.ttsforfree.com/api/common/getListVoice?language=pt');
    const data = await res.json();
    console.log('Keys:', Object.keys(data));
    const voices = data.data || data;
    console.log('Total voices:', voices.length);
    const geminiVoices = voices.filter(v => 
      (v.ShortName && v.ShortName.includes('Advisor')) || 
      (v.FriendlyName && v.FriendlyName.includes('Advisor')) ||
      (v.Provider && v.Provider.toLowerCase().includes('gemini'))
    );
    console.log('Gemini / Advisor voices:', geminiVoices.map(v => ({
      ShortName: v.ShortName,
      FriendlyName: v.FriendlyName,
      Locale: v.Locale,
      Provider: v.Provider,
      Gender: v.Gender
    })));
  } catch(e) {
    console.error(e);
  }
}
testApi();
