import http from 'k6/http'
import { check, sleep } from 'k6'
import { generateReports } from '../../../lib/reporter.js'

export default function () {
  const data = { username: 'username', password: 'password' }
  let res = http.post('https://myapi.com/login/', data)

  check(res, { 'success login': (r) => r.status === 200 })

  sleep(0.3)
}

export function handleSummary(data) {
  data.metadata = { url: 'https://myapi.com/login/' };
  return generateReports(data, "Default-API-Login");
}
