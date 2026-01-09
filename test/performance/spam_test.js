import http from 'k6/http';
import { check } from 'k6';
import { generateReports } from '../../lib/reporter.js';

export const options = {
  scenarios: {
    flood: {
      executor: 'constant-arrival-rate',
      rate: 100, // 100 RPS
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 100,
      maxVUs: 500,
    },
  },
};

const URL = __ENV.BASE_URL || 'https://example.com';

export default function () {
  let res = http.get(URL);
  check(res, { 'status is 200': (r) => r.status === 200 });
}

export function handleSummary(data) {
  return generateReports(data, "spam-test");
}
