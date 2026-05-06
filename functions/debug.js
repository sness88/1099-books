exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const clientId = process.env.PLAID_CLIENT_ID;
  const secret = process.env.PLAID_SECRET;

  // Test actual Plaid call
  let plaidResult = null;
  let plaidError = null;

  try {
    const response = await fetch('https://production.plaid.com/link/token/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        secret: secret,
        user: { client_user_id: 'test-user' },
        client_name: '1099 Books',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en',
      }),
    });
    plaidResult = await response.json();
  } catch (e) {
    plaidError = e.message;
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      env_check: {
        client_id_set: !!clientId,
        client_id_length: clientId?.length || 0,
        secret_set: !!secret,
        secret_length: secret?.length || 0,
      },
      plaid_response: plaidResult,
      plaid_error: plaidError,
    }, null, 2),
  };
};
