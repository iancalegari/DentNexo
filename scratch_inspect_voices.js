async function inspectVoices() {
  try {
    const res = await fetch('https://ttsforfree.com/api/common/getListVoice?language=pt');
    const data = await res.json();
    console.log('Result type:', typeof data);
    const voices = Array.isArray(data) ? data : data.data || data.voices || [];
    console.log('Voices count:', voices.length);
    const gemini = voices.filter(v => JSON.stringify(v).toLowerCase().includes('advisor') || JSON.stringify(v).toLowerCase().includes('gemini'));
    console.log('Gemini voices:', JSON.stringify(gemini, null, 2));
  } catch(e) {
    console.error(e);
  }
}
inspectVoices();
