# File Uploader Frontend

A modern, responsive cloud storage application built with React that allows users to upload, organize, and manage files and folders with an intuitive interface.

## Features

- **Authentication System** - Secure login and signup with session management
- **Folder Management** - Create nested folders and navigate through directory structures
- **File Upload** - Multi-file upload
- **File Preview** - In-app preview for various file types
- **File Sharing** - Generate shareable links with one click
- **Download Files** - Download files directly to your device
- **Rename** - Rename files and folders
- **Delete** - Remove files and folders
- **Sorting** - Sort by name, date modified, or file size
- **Responsive Design** - Optimized for both desktop and mobile devices
- **Smooth Animations** - GSAP and Lottie animations for enhanced UX

## Tech Stack

- **React 19** - UI library
- **React Router 7** - Client-side routing
- **Vite** - Build tool and dev server
- **GSAP** - Animation library
- **Lottie** - Vector animations
- **Lenis** - Smooth scrolling

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server running (default: `http://localhost:8000`)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd uploader_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
uploader_frontend/
├── public/
│   └── assets/          # Static assets (icons, animations)
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React context (AuthContext)
│   ├── pages/           # Page components
│   ├── routes/          # Route configuration
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Root component
│   └── main.jsx         # Entry point
├── .env                 # Environment variables
└── package.json
```

## Key Components

- **AuthHome** - Main authenticated dashboard
- **DesktopView** - Desktop layout with table view
- **MobileView** - Mobile-optimized layout
- **FileTableRow** - Individual file/folder row
- **CreateFolderDialog** - Folder creation modal
- **UploadFileDialog** - File upload modal
- **FilePreviewDialog** - File preview modal
- **RenameDialog** - Rename modal

## API Integration

The app expects a backend API with the following endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `GET /api/all` - Get root files/folders
- `GET /api/folders/folder/:id` - Get folder contents
- `GET /api/folders/folder/:id/path` - Get folder path
- `POST /api/folders/create/folder` - Create folder
- `DELETE /api/folders/delete/folder/:id` - Delete folder
- `POST /api/upload` - Upload files
- `GET /api/files/:id/preview` - Get file preview URL
- `DELETE /api/files/:id` - Delete file

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of The Odin Project curriculum.

## Acknowledgments

- Icons from SVG Repo
- Animations from LottieFiles
- Built as part of The Odin Project
