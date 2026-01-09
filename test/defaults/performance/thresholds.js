import http from 'k6/http'
import { sleep } from 'k6'
import { generateReports } from '../../../lib/reporter.js'

export let options = {
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1500'],
  },
}

export default function () {
  const BASE_URL = 'https://test-api.k6.io'

  http.get(`${BASE_URL}/public/crocodiles`)
  http.get(`${BASE_URL}/public/crocodiles/1`)
  http.get(`${BASE_URL}/public/crocodiles/2`)
  sleep(0.3)
}

export function handleSummary(data) {
  data.metadata = { url: 'https://test-api.k6.io' };
  return generateReports(data, "Default-Thresholds");
}
