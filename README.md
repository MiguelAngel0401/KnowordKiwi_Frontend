# Knoword Frontend

This is the frontend application for the Knoword project built with Next.js.

## Features

- Next.js 14 with App Router
- TypeScript
- Responsive design
- Modern UI components
- Integration with the Knoword backend API

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized setup)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

The application will be available at `http://localhost:3000`.

## Running with Docker

The frontend can also be run using Docker as part of the complete application stack.

1. Navigate to the project root directory (where docker-compose.yaml is located)
2. Run the following command to start the entire application:
   ```bash
   docker-compose up --build
   ```

This will start all services including the frontend, backend, database, and other required services.

To run only the frontend container:

```bash
docker-compose up --build frontend
```

To stop the containers:

```bash
docker-compose down
```

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Lint the codebase

## Project Structure

- `app/` - Next.js app directory with page routes
- `components/` - Reusable React components
- `public/` - Static assets
- `styles/` - Global styles and CSS files
- `lib/` - Utility functions and shared logic
- `types/` - TypeScript type definitions
