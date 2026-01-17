# File Uploader Frontend

A modern, responsive cloud storage application built with React that allows users to upload, organize, and manage files and folders with an intuitive interface.

## Features

- **Authentication System** - Secure login and signup with session management
- **Folder Management** - Create nested folders and navigate through directory structures
- **File Upload** - Multi-file upload with drag-and-drop support
- **File Preview** - In-app preview for various file types (images, PDFs, videos)
- **File Sharing** - Generate shareable links with one click
- **Download Files** - Download files directly to your device
- **Rename** - Rename files and folders inline
- **Delete** - Remove files and folders with confirmation
- **Search** - Real-time search across files and folders
- **Sorting** - Sort by name, date modified, or file size (ascending/descending)
- **Breadcrumb Navigation** - Easy navigation through folder hierarchy
- **User Menu** - Dropdown menu with logout functionality
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - GSAP and Lottie animations for enhanced UX
- **Modern UI** - Clean, intuitive interface with modal dialogs

## Tech Stack

- **React 19** - Modern UI library with latest features
- **React Router 7** - Client-side routing and navigation
- **Vite 7** - Lightning-fast build tool and dev server
- **GSAP** - Professional-grade animation library
- **Lottie** - Lightweight vector animations
- **Lenis** - Smooth scrolling experience

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server running (default: `http://localhost:8000`)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Ayoroq/uploader_frontend.git
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

- **AuthHome** - Main authenticated dashboard with state management
- **Navbar** - Navigation bar with user menu and logout
- **DesktopView** - Desktop layout with sortable table view
- **MobileView** - Mobile-optimized card layout with fixed bottom action bar
- **FileTableRow** - Individual file/folder row with context menu
- **Card** - Mobile card component for files and folders
- **CreateFolderDialog** - Modal for folder creation
- **UploadFileDialog** - Multi-file upload modal with preview
- **FilePreviewDialog** - Full-screen file preview modal
- **RenameDialog** - Inline rename modal for files and folders

## API Integration

The app expects a backend API with the following endpoints:

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Files & Folders
- `GET /api/all` - Get root files/folders
- `GET /api/folders/folder/:id` - Get folder contents
- `GET /api/folders/folder/:id/path` - Get folder breadcrumb path
- `POST /api/folders/create/folder` - Create new folder
- `POST /api/folders/create/folder/:id` - Create subfolder
- `PATCH /api/folders/update/folder/:id` - Rename folder
- `DELETE /api/folders/delete/folder/:id` - Delete folder
- `POST /api/upload` - Upload files to root
- `POST /api/upload/:id` - Upload files to folder
- `GET /api/files/:id/preview` - Get file preview/download URL
- `PATCH /api/files/:id` - Rename file
- `DELETE /api/files/:id` - Delete file

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

## Performance

- Optimized with React.memo and useCallback hooks
- Lazy loading for better initial load times
- Efficient state management
- Minimal re-renders
- Production build size: ~1.1MB (gzipped: ~235KB)

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

MIT License - This project is part of The Odin Project curriculum.

## Acknowledgments

- Icons from SVG Repo
- Animations from LottieFiles
- Built as part of The Odin Project
