import http from 'k6/http';
import { check, sleep } from 'k6';
import { generateReports } from '../../lib/reporter.js';

export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '2m', target: 300 }, // stress point
    { duration: '2m', target: 0 },
  ],
};

const URL = __ENV.BASE_URL || 'https://example.com';

export default function () {
  let res = http.get(URL);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}

export function handleSummary(data) {
  return generateReports(data, "stress-test");
}
