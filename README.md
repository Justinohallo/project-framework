# Project Framework

A modern Next.js 16 application with TypeScript, Tailwind CSS, Prisma ORM, and comprehensive linting setup.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or remote)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up your database connection:

Create a `.env` file in the root directory and add your PostgreSQL connection string:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/project_framework"
```

Replace `username`, `password`, `localhost`, `5432`, and `project_framework` with your actual database credentials.

**Note**: This project uses Prisma 7 with the PostgreSQL adapter (`@prisma/adapter-pg`), which provides improved performance and compatibility with edge runtimes.

3. Push the database schema:

```bash
npm run db:push
```

This command syncs your Prisma schema with your database without creating migration files.

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

### Database

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed the database

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
project-framework/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   └── api/              # API routes
│   │       └── users/        # Example user API
│   ├── components/           # React components
│   ├── lib/                  # Utility functions
│   │   └── prisma.ts        # Prisma client singleton
│   ├── types/               # TypeScript type definitions
│   └── generated/           # Generated Prisma Client
├── .husky/                   # Git hooks
└── package.json
```

## Database Schema

The project includes an example User model in `prisma/schema.prisma`:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## API Routes

### Users API

- `GET /api/users` - Fetch all users
- `POST /api/users` - Create a new user

Example request:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "name": "John Doe"}'
```

## Git Hooks

Pre-commit hooks are configured with Husky to automatically:

- Run ESLint and fix issues
- Format code with Prettier
- Run TypeScript type checking

These checks run automatically before each commit to maintain code quality.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Make sure to:

1. Add your `DATABASE_URL` environment variable in your deployment platform
2. Run `npm run db:push` or migrations after deployment

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
