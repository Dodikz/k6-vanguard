import http from "k6/http";
import { sleep } from "k6";
import { generateReports } from "../../../lib/reporter.js";

const accessToken = "YOUR_GITHUB_ACCESS_TOKEN";

export default function () {
  const query = `   
    query FindFirstIssue {  
      repository(owner:"grafana", name:"k6") {  
        issues(first:1) {   
          edges {   
            node {  
              title 
            }   
          }
        }
      }
    }`;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
  http.post(
    "https://api.github.com/graphql",
    JSON.stringify({ query: query }),
    { headers: headers }
  );
  sleep(0.3);
}

export function handleSummary(data) {
  data.metadata = { url: "https://api.github.com/graphql" };
  return generateReports(data, "Default-GraphQL");
}
