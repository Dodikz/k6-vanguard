import http from 'k6/http';
import { check, sleep } from 'k6';
import { generateReports } from '../../lib/reporter.js';

export const options = {
  stages: [
    { duration: '10s', target: 20 },
    { duration: '20s', target: 500 }, // sudden spike
    { duration: '1m', target: 500 },
    { duration: '20s', target: 20 },
    { duration: '10s', target: 0 },
  ],
};

const URL = __ENV.BASE_URL || 'https://example.com';

export default function () {
  let res = http.get(URL);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}

export function handleSummary(data) {
  return generateReports(data, "spike-test");
}
