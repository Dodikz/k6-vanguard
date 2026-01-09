import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { generateReports } from '../../lib/reporter.js';

export const options = {
  vus: 10,
  duration: '1m',
  thresholds: {
    'http_req_duration': ['p(95)<1000'],
  },
};

const GRAPHQL_URL = __ENV.GRAPHQL_URL || 'https://api.example.com/graphql';

const query = `
  query GetUserData($id: ID!) {
    user(id: $id) {
      id
      username
      email
    }
  }
`;

export default function () {
  group('GraphQL Operations', function () {
    const payload = JSON.stringify({
      query: query,
      variables: { id: "1" },
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let res = http.post(GRAPHQL_URL, payload, params);

    check(res, {
      'is status 200': (r) => r.status === 200,
      'no graphql errors': (r) => !r.json().errors,
    });
  });

  sleep(1);
}

export function handleSummary(data) {
  return generateReports(data, "graphql-test");
}
