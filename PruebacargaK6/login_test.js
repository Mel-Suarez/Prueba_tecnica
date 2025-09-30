import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// Cargar y parsear CSV manualmente
const users = new SharedArray('usuarios', function () {
  const csv = open('./usuarios.csv').split('\n').slice(1); // quitar cabecera
  return csv.map(line => {
    const [user, passwd] = line.split(',');
    return { user: user.trim(), passwd: passwd.trim() };
  });
});

export const options = {
  stages: [
    { duration: '10s', target: 20 },
    { duration: '30s', target: 20 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500'],  // 95% de respuestas < 1.5s
    http_req_failed: ['rate<0.03'],     // tasa de error < 3%
  },
};

export default function () {
  const randomUser = users[Math.floor(Math.random() * users.length)];

  const payload = JSON.stringify({
    username: randomUser.user,
    password: randomUser.passwd,
  });

  const headers = { 'Content-Type': 'application/json' };

  const res = http.post('https://fakestoreapi.com/auth/login', payload, { headers });

  check(res, {
    'status es 200': (r) => r.status === 200,
    'respuesta < 1.5s': (r) => r.timings.duration < 1500,
    'respuesta contiene token': (r) => r.body.includes('token'),
  });

  sleep(1);
}
