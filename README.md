# Marketplace Microservices Platform

A modern marketplace platform built with microservices architecture.

## Services

### Core Services
- Auth Service (Port: 3001)
- Product Service (Port: 3002)
- Order Service (Port: 3003)

### Infrastructure
- API Gateway (Port: 4000)
- MongoDB
- Redis

## Tech Stack
- NestJS
- MongoDB
- Docker
- Kubernetes
- Redis
- TypeScript

## Getting Started

### Prerequisites
- Node.js 18+
- Docker
- Docker Compose
- MongoDB

### Installation
1. Clone the repository
bash
git clone https://github.com/[your-username]/marketplace-microservices.git
2. Install dependencies
bash
npm run start:dev
## Project Structure
marketplace-microservices/
├── services/
│ ├── auth-service/ # Authentication & User Management
│ ├── product-service/ # Product Management
│ └── order-service/ # Order Processing
├── api-gateway/ # API Gateway
├── docker/ # Docker Configurations
└── k8s/ # Kubernetes Configurations

## Contributing
[Contributing guidelines]

## License
This project is licensed under the MIT License - see the LICENSE file for details