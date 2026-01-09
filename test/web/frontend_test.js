import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { generateReports } from '../../lib/reporter.js';
import { env } from '../../configs/env.js';

export const options = {
  scenarios: {
    frontend_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 20 },
        { duration: '1m', target: 20 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: { 
    'http_req_duration': ['p(95)<2000'],
  },
};

const PAGE_URL = __ENV.BASE_URL || env.BASE_URL;

export default function () {
  group('Frontend Page Load', function () {
    // 1. Core Page Request
    let res = http.get(PAGE_URL);
    check(res, {
      'page status is 200': (r) => r.status === 200,
      'verify homepage text': (r) => r.body.includes('Example Domain') || r.body.includes('Dodik'),
    });

    // 2. Batch Asset Loading
    http.batch([
      ['GET', `${PAGE_URL}/favicon.ico`, null, { tags: { staticAsset: 'yes' } }],
    ]);
  });

  sleep(2);
}

export function handleSummary(data) {
  data.metadata = { url: PAGE_URL };
  return generateReports(data, "frontend-test");
}
