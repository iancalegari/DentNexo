const crypto = require('crypto');

async function getSignature(key = "keycuattsforfree") {
  const timestamp = Math.floor(Date.now() / 1000);
  const data = `${timestamp}:${key}`;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return {
    "x-signature": hash,
    "x-timestamp": timestamp.toString()
  };
}

async function testTTS() {
  const sig = await getSignature();
  console.log('Sig:', sig);

  // 1. Get voice list to find the exact voice ID for Authoritative Advisor 2 Gemini (Brazilian Portuguese)
  const voiceRes = await fetch('https://api.ttsforfree.com/api/common/getListVoice?language=pt', {
    headers: {
      ...sig,
      "Pn-Client-Language": "pt-br",
      "X-Client-Id": crypto.randomUUID()
    }
  });

  const voiceData = await voiceRes.json();
  const voices = voiceData.data || voiceData;
  console.log('Total pt voices:', voices.length);
  
  const advisor = voices.filter(v => 
    JSON.stringify(v).toLowerCase().includes('advisor') || 
    JSON.stringify(v).toLowerCase().includes('gemini')
  );
  console.log('Matching Gemini Advisor:', advisor);

  const chosenVoice = advisor.length > 0 ? advisor[0].ShortName : 'pt-BR-Wavenet-B';
  console.log('Using voice:', chosenVoice);

  // 2. Generate Audio
  const createSig = await getSignature();
  const createRes = await fetch('https://api.ttsforfree.com/api/tts/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...createSig,
      "Pn-Client-Language": "pt-br",
      "X-Client-Id": crypto.randomUUID()
    },
    body: JSON.stringify({
      Texts: ["A mandíbula é o maior, mais resistente e único osso móvel do esqueleto facial humano."],
      Voice: chosenVoice,
      Volume: 1,
      Speed: 1,
      Pitch: 0,
      ConnectionId: "",
      Emotion: ""
    })
  });

  const result = await createRes.json();
  console.log('Create result:', JSON.stringify(result, null, 2));
}

testTTS();
