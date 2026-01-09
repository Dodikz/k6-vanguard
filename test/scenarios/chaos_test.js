import http from 'k6/http';
import { check, sleep } from 'k6';
import { generateReports } from '../../lib/reporter.js';

export const options = {
  scenarios: {
    constant_load: {
      executor: 'constant-vus',
      vus: 10,
      duration: '5m',
    },
  },
  thresholds: {
    // We expect the system to maintain availability even under stress/faults
    'http_req_failed': ['rate<0.1'], // Error rate should stay under 10%
    'http_req_duration': ['p(95)<2000'], 
  },
};

const BASE_URL = __ENV.API_URL || 'https://api.example.com';

export default function () {
  // Simulate heavy traffic or targeted endpoint hits
  let res = http.get(`${BASE_URL}/health`);
  
  check(res, {
    'system is up': (r) => r.status === 200,
    'latency is acceptable': (r) => r.timings.duration < 1000,
  });

  sleep(0.5);
}

export function handleSummary(data) {
  return generateReports(data, "chaos-resilience-test");
}
