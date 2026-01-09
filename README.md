# K6 Performance Testing Framework (Enterprise Edition)

A professional-grade performance testing suite built for comprehensive HTTP, WebSocket, and GraphQL analysis. This framework provides advanced reporting, modular test management, and professional SLA verification.

## Architecture

The framework is organized into a modular structure to ensure scalability and ease of maintenance:

- **Library**: Core reporting engine with multi-theme support.
- **Configurations**: Centralized environment management via `.env` and `configs/env.js`.
- **Tests**: Specialized testing categories including API, Web, Performance, Protocol, and Scenarios.
- **Reports**: Automated high-fidelity HTML reports with interactive Tabbed Architecture.

## Reporting Excellence

The reporting system features specialized templates for every testing category:

- **API Analysis**: Focus on Availability, Throughput, and Payload volume.
- **Web Experience**: Insights into Load Times, Success Rates, and Bandwidth.
- **Performance Benchmarking**: Intensive visualization for Stress, Spike, and Soak testing.
- **Protocol Analysis**: Deep dive into TLS handshakes, connection timings, and data rates.
- **Chaos Scenarios**: Focus on system resiliency, iteration stability, and peak capacity.

## Key Visual Features

- **Tabbed Interface**: Overview, Technical Metrics, Execution Details, and Verification tabs.
- **Subtle Animations**: Fade-in and slide-in transitions for a modern UI/UX.
- **SLA Tracking**: Real-time monitoring of breached thresholds and failed assertions.
- **Professional Grid**: High-precision matrix for all technical timers (TTFB, Handshake, etc).

## Installation and Execution

Ensure that [k6](https://k6.io/) is installed on your system.

### Quick Start

1. Configure target parameters in `.env`.
2. Run specific tests or the entire suite:

| Command             | Description                                     |
| :------------------ | :---------------------------------------------- |
| `npm run test:api`  | Validate REST API endpoints                     |
| `npm run test:web`  | Execute frontend and asset analysis             |
| `npm run test:load` | Perform standard capacity testing               |
| `npm run test:all`  | Execute all tests sequentially (Cross-platform) |

## Attribution

Developed by **Dodik**.  
GitHub: [github.com/Dodikz](https://github.com/Dodikz)

## License

Distributed under the **MIT License**.
