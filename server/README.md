# Donation Platform Backend

This is the backend API server for the Donation Platform project.

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_PORT=3306
CORS_ORIGIN=http://localhost:3000
```

3. Run the development server:
```bash
npm run dev
```

## Deployment to Render

1. Sign up for a [Render account](https://render.com)

2. Create a new MySQL database or use an external MySQL service (like PlanetScale, AWS RDS, etc.)

3. Set up your Web Service on Render:
   - Connect your GitHub repository
   - Choose the server folder as your root directory
   - Set the Environment to Node
   - Add the Build Command: `npm install`
   - Add the Start Command: `npm start`

4. Add Environment Variables in the Render dashboard:
   - `DB_HOST` - Your MySQL host
   - `DB_USER` - Your MySQL username
   - `DB_PASSWORD` - Your MySQL password
   - `DB_NAME` - Your database name
   - `DB_PORT` - MySQL port (usually 3306)
   - `CORS_ORIGIN` - Your frontend URL (e.g., https://your-app.vercel.app)
   - `PORT` - Set to 10000 (Render's preferred port)

5. Deploy your service and update your frontend with the new API URL 