# Donation Platform

A modern platform built with Next.js and MySQL.

## Features

- Responsive design for all devices
- Contact form with email notifications

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=your-backend-url
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `src/components/` - React components
  - `ContactUs/` - Contact form component
  - `Hero/` - Hero section component
  - `Impact/` - Impact section component
  - `Sealink/` - Sealink section component

## Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   DB_HOST=your_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name
   DB_PORT=3306
   CORS_ORIGIN=http://localhost:3000
   PORT=10000
   ```

4. Run the development server:
   ```
   npm run dev
   ```

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the environment variables in Vercel dashboard
4. Deploy

### Backend (Render)
1. Create a MySQL database on Render or use an external service
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set the environment variables in Render dashboard
5. Deploy

## License

MIT
