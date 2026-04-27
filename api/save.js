// Vercel serverless function — guarda registro JCC en Supabase
const https = require('https');

const SUPA_URL  = 'https://vffmnyjjawvvctcqzkvj.supabase.co';
const SUPA_KEY  = process.env.SUPABASE_SERVICE_KEY || 'sb_publishable_A1rJIiXHSg6TQYT2gKQHUw_UTwmS76t';

function supaInsert(record) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify([record]);
    const opts = {
      hostname: 'vffmnyjjawvvctcqzkvj.supabase.co',
      path: '/rest/v1/seres',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'apikey': SUPA_KEY,
        'Authorization': 'Bearer ' + SUPA_KEY,
        'Prefer': 'return=minimal'
      }
    };
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST')   { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    const ser = req.body || {};
    if (!ser.nombre) {
      res.status(400).json({ error: 'Nombre requerido' });
      return;
    }

    const id  = ser.id || String(Date.now() + Math.floor(Math.random() * 1000));
    const row = {
      id,
      data: { ...ser, id, prospecto: true, marca: 'jcc' },
      updated_at: new Date().toISOString()
    };

    const result = await supaInsert(row);

    if (result.status >= 400) {
      console.error('Supabase error', result.status, result.data);
      res.status(200).json({ ok: false, supaError: result.status, detail: result.data });
      return;
    }

    res.status(200).json({ ok: true, id });
  } catch (e) {
    console.error('save handler error:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
};
