import http from 'http';

const postData = JSON.stringify({
  email: "nuevo2@test.com",
  password: "test1234",
  name: "Nuevo Usuario",
  confirmPassword: "test1234"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/sign-up/email',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing path:', options.path);
console.log('Post data:', postData);

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', JSON.stringify(res.headers));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('BODY:', data);
  });
});

req.on('error', (e) => {
  console.error('ERROR:', e.message);
});

req.write(postData);
req.end();
