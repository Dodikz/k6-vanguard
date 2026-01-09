import ws from 'k6/ws';
import { check } from 'k6';
import { generateReports } from '../../lib/reporter.js';

export const options = {
  vus: 5,
  duration: '30s',
};

const WS_URL = __ENV.WS_URL || 'wss://echo.websocket.org';

export default function () {
  const url = WS_URL;
  const params = { tags: { my_tag: 'hello' } };

  const res = ws.connect(url, params, function (socket) {
    socket.on('open', () => {
      console.log('connected');
      socket.send(JSON.stringify({ msg: 'hello' }));
    });

    socket.on('message', (data) => {
      console.log('Message received: ', data);
      socket.close();
    });

    socket.on('close', () => console.log('disconnected'));
    
    socket.setTimeout(function () {
      console.log('2 seconds passed, closing the socket');
      socket.close();
    }, 2000);
  });

  check(res, { 'status is 101': (r) => r && r.status === 101 });
}

export function handleSummary(data) {
  return generateReports(data, "websocket-test");
}
