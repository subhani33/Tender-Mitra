# Deployment Instructions

## Deploying to Tiiny.host (Static Frontend)

Tiiny.host allows you to quickly deploy and share static websites. Follow these steps to deploy the Tender Mitra frontend:

### 1. Build the project
```bash
# Install dependencies if you haven't already
npm install

# Build the project
npm run build
```

This will create a `dist` folder with your built static assets.

### 2. Create a ZIP file
```bash
# Navigate to the project root (if you're not already there)
cd /path/to/project

# Create a ZIP file of the dist folder
zip -r tender-mitra-dist.zip dist
```

### 3. Upload to Tiiny.host
1. Go to [Tiiny.host](https://tiiny.host/)
2. Click "Upload"
3. Drag and drop the `tender-mitra-dist.zip` file
4. Fill in the details:
   - Site name: `tender-mitra`
   - Password: (optional)
   - Expiry: Choose how long you want the site to be available

5. Click "Upload"

Your site will be available at `https://tender-mitra.tiiny.site` (or a similar URL provided by Tiiny.host).

### 4. Notes about the Static Deployment
- **Authentication**: The authentication features will not work in the static deployment, as they require a backend server.
- **Mock Data**: The site will show mock data for tenders and other content.
- **Limitations**: Form submissions and other dynamic features that require a server will not work.

## Full Deployment (Frontend + Backend)

For a full deployment with functional authentication and backend services:

1. Set up a Render account at [render.com](https://render.com)
2. Create a new Web Service for the backend
3. Create a new Static Site for the frontend
4. Configure the environment variables for each service
5. Connect to a MongoDB database or other persistent storage

See the `render.yaml` file in the project root for configuration details.

## Local Development Testing

To test the full application locally:

```bash
# Start the backend server
npm run server

# In a separate terminal, start the frontend
npm run client
```

Access the site at http://localhost:5173. The backend will be running at http://localhost:3000. 