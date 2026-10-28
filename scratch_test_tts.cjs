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

async function findAdvisor2() {
  const sig = await getSignature();
  const voiceRes = await fetch('https://api.ttsforfree.com/api/common/getListVoice?language=pt', {
    headers: {
      ...sig,
      "Pn-Client-Language": "pt-br",
      "X-Client-Id": crypto.randomUUID()
    }
  });

  const voiceData = await voiceRes.json();
  const voices = voiceData.Data || [];
  
  const advisor2 = voices.find(v => (v.FreindlyName || '').includes('Authoritative Advisor 2 Gemini (Brazilian Portuguese)'));
  console.log('Voice info:', advisor2);

  if (advisor2) {
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
        Texts: ["A mandíbula é o maior osso facial."],
        Voice: advisor2.VoiceName,
        Volume: 1,
        Speed: 1,
        Pitch: 0,
        ConnectionId: "",
        Emotion: ""
      })
    });
    const result = await createRes.json();
    console.log('Creation response:', result);
  }
}

findAdvisor2();
