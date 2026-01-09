import http from 'k6/http';
import { check, sleep } from 'k6';
import { generateReports } from '../../lib/reporter.js';

import { env } from '../../configs/env.js';

export const options = {
  stages: [
    { duration: '2m', target: 50 }, 
    { duration: '5m', target: 50 }, 
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<2000'],
  },
};

const URL = __ENV.BASE_URL || env.BASE_URL;

export default function () {
  let res = http.get(URL);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}

export function handleSummary(data) {
  data.metadata = { url: URL };
  return generateReports(data, "load-test");
}
