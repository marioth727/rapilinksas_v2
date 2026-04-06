const apiKey = process.env.VITE_GEMINI_API_KEY;

async function testREST() {
   const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         contents: [{ role: 'user', parts: [{ text: 'Hola como estas?' }] }],
         systemInstruction: { parts: [{ text: 'Responde corto' }] }
      })
   });
   const data = await res.json();
   console.log(JSON.stringify(data, null, 2));
}

testREST().catch(console.error);
