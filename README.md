# CreatorBoost AI

Built an AI-powered content automation platform for creators that converts video transcripts into optimized YouTube titles, captions, descriptions, hashtags, and summaries using LLM APIs with JWT authentication and MongoDB persistence.

## Features
- **User Authentication**: Secure JWT-based login and registration.
- **AI Content Generation**: Uses Groq API (LLaMA3) to parse video transcripts and generate optimized metadata.
- **Content History**: Saves generated content to MongoDB, viewable in a user-specific dashboard.
- **Modern UI**: Clean, responsive, and sleek interface built with React and Tailwind CSS.
- **1-Click Copy**: Easily copy generated titles, descriptions, and hashtags to clipboard.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Axios, React Router DOM, Vite
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt
- **AI Integration**: Groq SDK (Llama3-8b-8192 model)

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster (or local MongoDB instance)
- Groq API Key

### Backend Setup
1. Navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Fill in the `.env` file with your credentials:
   ```env
   PORT=5000
   CORS_ORIGIN=http://localhost:5173
   MONGODB_URI=<Your MongoDB URI>
   ACCESS_TOKEN_SECRET=<Your Secret Key>
   ACCESS_TOKEN_EXPIRY=1d
   GROQ_API_KEY=<Your Groq API Key>
   ```
4. Start the backend server: `npm run dev`

### Frontend Setup
1. Navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the frontend development server: `npm run dev`

## Deployment
- **Frontend**: Recommended deployment on Vercel or Netlify.
- **Backend**: Recommended deployment on Render or Railway.
- **Database**: MongoDB Atlas.

## Key Challenges Solved
- Integrated streaming/JSON-response capabilities from Groq AI to ensure structured output generation.
- Implemented HTTP-only cookies for secure JWT storage and transmission between the decoupled frontend and backend.
- Built a reusable Axios instance to automatically handle credentials across cross-origin requests.
