exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  try {
    const { access_token, start_date, end_date, offset, count } = JSON.parse(event.body);
    const response = await fetch('https://production.plaid.com/transactions/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_SECRET,
        access_token,
        start_date: start_date || new Date(Date.now() - 365*24*60*60*1000).toISOString().slice(0,10),
        end_date: end_date || new Date().toISOString().slice(0,10),
        options: { count: count || 500, offset: offset || 0 }
      }),
    });
    const data = await response.json();
    if (data.error_message) return { statusCode: 400, headers, body: JSON.stringify({ error: data.error_message }) };
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
