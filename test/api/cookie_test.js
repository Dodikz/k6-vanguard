import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { generateReports } from '../../lib/reporter.js';
import { env } from '../../configs/env.js';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    'http_req_duration': ['p(95)<1000'],
  },
};

const BASE_URL = __ENV.BASE_URL || env.BASE_URL;

export default function () {
  group('Cookie Management Test', function () {
    // 1. Initial request to get a cookie
    let res = http.get(`${BASE_URL}/id/contact`); // Custom URL or example
    
    // Check cookie
    const jar = http.cookieJar();
    const cookies = jar.cookiesForURL(BASE_URL);

    check(res, {
      'status is 200': (r) => r.status === 200,
    });

    // 2. Custom cookie manually
    jar.set(BASE_URL, 'test_cookie', 'k6-is-awesome', {
      domain: 'example.com',
      path: '/',
      secure: true,
    });

    // 3. Request with cookies
    let res2 = http.get(`${BASE_URL}`, {
      cookies: {
        'manual_session': '123456789',
      },
    });

    check(res2, {
      'cookie-based request status 200': (r) => r.status === 200,
    });
  });

  sleep(1);
}

export function handleSummary(data) {
  return generateReports(data, "Cookie Management Test");
}
