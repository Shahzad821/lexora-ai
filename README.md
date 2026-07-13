# Lexora AI

Lexora AI is a modern AI-powered creative and productivity platform built with React, Vite, Express, and Clerk authentication. It helps users generate articles, blog titles, and images while also offering tools for resume review, background removal, and object removal.

## Overview

Lexora AI combines a polished user experience with practical AI workflows for content creators, marketers, founders, and professionals. The platform is designed to make AI tools easy to use through a clean dashboard and streamlined prompts.

## Key Features

- AI article generation with tone, length, and audience customization
- Blog title generation for content planning
- AI image generation
- Image editing tools for background and object removal
- Resume review assistance
- Secure user authentication and usage tracking
- Responsive dashboard experience for desktop and mobile

## Project Structure

```text
api/           # Express backend and AI controller routes
client/        # React + Vite frontend
```

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Lucide Icons
- Clerk Auth

### Backend

- Node.js
- Express
- OpenAI API integration
- Cloudinary for image storage
- Neon/Postgres-compatible SQL access

## Screenshots

Here are three reserved spaces for your project screenshots:

### Image 1

<img width="1366" height="607" alt="lexora home page" src="https://github.com/user-attachments/assets/fd617726-d2fe-411e-bb68-4421d8edf33b" />


### Image 2

<img width="1362" height="606" alt="lexora dashboard" src="https://github.com/user-attachments/assets/3de252fd-00b2-4513-97c0-c737de9726a9" />


### Image 3

<img width="1366" height="608" alt="lexora community" src="https://github.com/user-attachments/assets/b910c16b-8df8-4125-b182-c1af9c8b8dd5" />


## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- A valid OpenAI-compatible API key
- Clerk account credentials
- Cloudinary account credentials

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Lexora-ai
```

### 2. Install dependencies

#### Backend

```bash
cd api
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `api` folder and add the required values:

```env
LEXORA_API_KEY=your_api_key
LEXORA_BASE_URL=your_api_base_url
LEXORA_MODEL=gemini-3.5-flash
LEXORA_IMAGE_MODEL=gpt-image-1
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
DATABASE_URL=your_database_url
FREE_USAGE_LIMIT=10
```

### 4. Run the application

#### Backend

```bash
cd api
npm run dev
```

#### Frontend

```bash
cd client
npm run dev
```

The frontend will run on the Vite dev server, and the backend will run on the Express server.

## Usage

Once the app is running:

1. Sign in with Clerk authentication
2. Open the dashboard
3. Choose a tool such as article writing, blog titles, image generation, or resume review
4. Enter your prompt and generate content

## Roadmap

- Add saved drafts and history
- Improve prompt templates for each AI tool
- Add export options for generated content
- Introduce team collaboration features
- Expand analytics and usage insights

## License

This project is licensed under the MIT License.

## Contact

For questions or collaboration opportunities, please reach out through the project maintainer.
