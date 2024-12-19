# Marketplace Microservices Platform

A modern marketplace platform built with microservices architecture.

# Project Structure

```bash
marketplace-microservices/
└── services/
    └── auth-service/              # Authentication & User Management Service
        ├── src/                   # Source code
        │   ├── auth/              # Authentication module
        │   │   ├── controllers/   # Auth controllers
        │   │   │   ├── auth.controller.ts
        │   │   │   └── google-auth.controller.ts
        │   │   ├── decorators/    # Custom decorators
        │   │   │   └── roles.decorator.ts
        │   │   ├── dto/          # Data Transfer Objects
        │   │   │   ├── auth-credentials.dto.ts
        │   │   │   ├── login.dto.ts
        │   │   │   └── register.dto.ts
        │   │   ├── interfaces/    # TypeScript interfaces
        │   │   │   ├── jwt-payload.interface.ts
        │   │   │   └── token.interface.ts
        │   │   ├── schemas/      # MongoDB schemas
        │   │   │   ├── audit-log.schema.ts
        │   │   │   ├── blocked-ip.schema.ts
        │   │   │   └── device.schema.ts
        │   │   ├── services/     # Auth-related services
        │   │   │   ├── session.service.ts
        │   │   │   ├── ip-blocking.service.ts
        │   │   │   ├── login-attempts.service.ts
        │   │   │   ├── device-tracking.service.ts
        │   │   │   └── suspicious-activity.service.ts
        │   │   ├── strategies/   # Passport strategies
        │   │   │   ├── google.strategy.ts
        │   │   │   └── jwt.strategy.ts
        │   │   ├── types/       # Type definitions
        │   │   │   └── role.enum.ts
        │   │   ├── utils/       # Utility functions
        │   │   │   └── auth.utils.ts
        │   │   ├── auth.controller.ts
        │   │   ├── auth.module.ts
        │   │   └── auth.service.ts
        │   │
        │   ├── users/           # Users module
        │   │   ├── dto/         # User DTOs
        │   │   │   ├── create-user.dto.ts
        │   │   │   └── update-user.dto.ts
        │   │   ├── schemas/     # User-related schemas
        │   │   │   └── user.schema.ts
        │   │   ├── users.controller.ts
        │   │   ├── users.module.ts
        │   │   └── users.service.ts
        │   │
        │   ├── common/          # Shared resources
        │   │   ├── decorators/  # Common decorators
        │   │   ├── filters/     # Exception filters
        │   │   │   └── http-exception.filter.ts
        │   │   └── interceptors/# Request interceptors
        │   │       └── logging.interceptor.ts
        │   │
        │   ├── config/         # Configuration
        │   │   ├── configuration.ts
        │   │   └── validation.ts
        │   │
        │   ├── email/          # Email module
        │   │   ├── email.module.ts
        │   │   └── email.service.ts
        │   │
        │   ├── guards/         # Auth guards
        │   │   └── jwt-auth.guard.ts
        │   │
        │   ├── rate-limit/     # Rate limiting
        │   │   ├── rate-limit.module.ts
        │   │   └── rate-limit.service.ts
        │   │
        │   ├── app.controller.ts
        │   ├── app.module.ts
        │   ├── app.service.ts
        │   └── main.ts
        │
        ├── test/              # Test files
        │   ├── e2e/          # End-to-end tests
        │   │   └── auth.e2e-spec.ts
        │   └── unit/         # Unit tests
        │       └── auth.service.spec.ts
        │
        ├── .dockerignore     # Docker ignore file
        ├── .env              # Environment variables
        ├── .env.example      # Environment variables example
        ├── .eslintrc.js     # ESLint configuration
        ├── .gitignore       # Git ignore file
        ├── .prettierrc      # Prettier configuration
        ├── Dockerfile       # Docker configuration
        ├── jest.config.js   # Jest configuration
        ├── nest-cli.json    # NestJS CLI configuration
        ├── package.json     # Project dependencies
        ├── tsconfig.json    # TypeScript configuration
        └── tsconfig.build.json # TypeScript build configuration

```

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
   git clone https://github.com/ngtrnhao/marketplace-microservices.git
2. Install dependencies
   bash
   npm run start:dev
   tree
   marketplace-microservices/
   ├── services/
   │ ├── auth-service/ # Authentication & User Management
   │ │ ├── src/
   │ │ │ ├── auth/
   │ │ │ ├── users/
   │ │ │ └── common/
   │ │ ├── test/
   │ │ │ ├── e2e/
   │ │ │ └── unit/
   │ │ ├── Dockerfile
   │ │ └── README.md
   │ ├── product-service/ # Product Management
   │ └── order-service/ # Order Processing
   ├── api-gateway/ # API Gateway
   ├── docker/ # Docker Configurations
   │ ├── docker-compose.yml
   │ └── Dockerfile.
   └── k8s/ # Kubernetes Configurations

## Contributing

[Contributing guidelines]

## License

# This project is licensed under the MIT License - see the LICENSE file for details

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

> > > > > > > master

# GitHub Rules

## Commit Message Format

bash
<type>(<scope>): <subject>

<body>
<footer>

### Types

- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Thay đổi tài liệu
- `style`: Format code, thiếu dấu chấm phẩy, etc
- `refactor`: Tái cấu trúc code
- `test`: Thêm test hoặc sửa test
- `chore`: Cập nhật công cụ build, cấu hình CI, etc

### Scope

- `auth`: Authentication/Authorization
- `user`: User management
- `security`: Security features
- `api`: API endpoints
- `db`: Database changes
- `config`: Configuration changes

### Scope

- `auth`: Authentication/Authorization
- `user`: User management
- `security`: Security features
- `api`: API endpoints
- `db`: Database changes
- `config`: Configuration changes

### Subject

- Không quá 50 ký tự
- Bắt đầu bằng động từ (add, update, change, etc)
- Không viết hoa chữ đầu
- Không dấu chấm ở cuối

### Body

- Giải thích chi tiết những thay đổi
- Mỗi dòng không quá 72 ký tự
- Giải thích lý do và so sánh với cách làm cũ

### Footer

- Đánh dấu breaking changes
- Tham chiếu đến issues và pull requests
- Format: `BREAKING CHANGE: <description>`

## Ví dụ:

bash
feat(auth): implement IP blocking mechanism
Add IP blocking service
Add failed login attempts tracking
Add suspicious activity detection
Configure blocking duration and thresholds
BREAKING CHANGE: New security features require database schema updates
Closes #123

## Branch Naming

- Feature: `feature/auth-ip-blocking`
- Bugfix: `fix/login-validation`
- Hotfix: `hotfix/security-vulnerability`
- Release: `release/v1.2.0`

## Pull Request Rules

1. Mô tả chi tiết các thay đổi
2. Liên kết với issues liên quan
3. Cập nhật documentation nếu cần
4. Đảm bảo CI/CD pass
5. Code review bởi ít nhất 1 người
6. Không conflicts với main branch

## Code Review Guidelines

1. Kiểm tra security vulnerabilities
2. Đảm bảo code coverage > 80%
3. Tuân thủ coding standards
4. Kiểm tra performance impacts
5. Verify error handling
6. Review test cases

## Security Guidelines

1. Không commit sensitive data
2. Sử dụng environment variables
3. Regular security audits
4. Dependency version control
5. Access control verification

# Auth Service

## Description
Authentication and User Management service for the Marketplace Microservices Platform. Handles user authentication, authorization, and session management.

## Features

- User Authentication
  - Local authentication with email/password
  - Google OAuth 2.0 integration
  - JWT-based authentication

- Session Management
  - Redis-based session storage
  - Secure session handling
  - Session expiration and renewal

- Security Features
  - IP blocking for suspicious activities
  - Failed login attempts tracking
  - Device tracking
  - Audit logging

- User Management
  - User registration
  - Profile management
  - Password reset
  - Email verification

## Tech Stack

- NestJS
- MongoDB (User data)
- Redis (Session management)
- Passport.js
- JWT
- Google OAuth 2.0

## Prerequisites

- Node.js (v18+)
- MongoDB
- Redis
- Google OAuth credentials

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Application
PORT=3001
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/auth-service

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

## Installation

```bash
# Install dependencies
npm install

# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Initiate Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Session Management
- `GET /api/auth/session` - Get current session info
- `POST /api/auth/session/renew` - Renew session
- `DELETE /api/auth/session` - Invalidate session

## Security

The service implements several security measures:
- Rate limiting
- IP blocking
- Session management
- Audit logging
- Device tracking
- Suspicious activity detection

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Docker

Build and run with Docker:

```bash
# Build image
docker build -t auth-service .

# Run container
docker run -p 3001:3001 auth-service
```

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.
