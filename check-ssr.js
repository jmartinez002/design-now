const http = require('http');

http.get('http://localhost:3001', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (data.includes('Abierto Briefs')) {
      console.log('SignupForm SSR IS PRESENT: found Abierto Briefs and Monthly Club');
    } else {
      console.log('SignupForm is TRULY MISSING from SSR.');
    }
  });
});
