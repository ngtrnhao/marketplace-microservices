
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
This project is licensed under the MIT License - see the LICENSE file for details
=======
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
>>>>>>> master
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
