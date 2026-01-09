import http from 'k6/http';
import { check, sleep } from 'k6';
import { generateReports } from '../../lib/reporter.js';

export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '4h', target: 50 }, // stay for 4 hours
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
  return generateReports(data, "soak-test");
}
