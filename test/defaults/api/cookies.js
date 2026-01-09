import http from 'k6/http'
import { generateReports } from '../../../lib/reporter.js'

export default function () {
  let cookies = {
    name: 'value1',
    name2: 'value2',
  }
  let res = http.get('http://httpbin.org/cookies', { cookies: cookies })
  // Since the cookies are set as "request cookies" they won't be added to VU cookie jar
  let vuJar = http.cookieJar()
  let cookiesForURL = vuJar.cookiesForURL(res.url)
}

export function handleSummary(data) {
  data.metadata = { url: 'http://httpbin.org/cookies' };
  return generateReports(data, "Default-Cookies");
}
