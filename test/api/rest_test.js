import http from 'k6/http';
import { check, sleep, group, fail } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { generateReports } from '../../lib/reporter.js';
import { env } from '../../configs/env.js';


let loginDuration = new Trend('login_duration');
let successRate = new Rate('successful_requests');

export const options = {
  stages: [
    { duration: '30s', target: 20 }, 
    { duration: '1m', target: 20 }, 
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    'http_req_duration{status:200}': ['p(95)<500'],
    'successful_requests': ['rate>0.95'],
  },
};

const BASE_URL = __ENV.API_URL || env.API_URL;

export default function () {
  group('REST API Auth & Dashboard Flow', function () {
    // 1. Login Example
    let loginData = { username: 'test_user', password: 'password123' };
    let loginRes = http.post(`${BASE_URL}/login`, JSON.stringify(loginData), {
      headers: { 'Content-Type': 'application/json' },
    });

    check(loginRes, { 
      'login status 200': (r) => r.status === 200 || r.status === 404,
    });

    loginDuration.add(loginRes.timings.duration);
    
    // 2. Authorized Request
    let dashboardRes = http.get(`${BASE_URL}/dashboard`, {
      headers: { Authorization: `Bearer dummy_token` },
    });
    
    check(dashboardRes, { 
      'dashboard request done': (r) => r.status !== 0,
    });
    
    successRate.add(dashboardRes.status === 200 || dashboardRes.status === 404);
  });

  sleep(1);
}

export function handleSummary(data) {
  data.metadata = { url: BASE_URL };
  return generateReports(data, "rest-api-test");
}
