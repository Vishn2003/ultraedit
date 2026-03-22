# DocEase — PDF Processing Toolkit

A production-grade, privacy-friendly PDF toolkit inspired by iLovePDF.

## Features

| Tool | Description |
|------|-------------|
| 🔗 **Merge PDFs** | Combine multiple PDFs into one |
| ✂️ **Split PDF** | Extract a page range from any PDF |
| 📦 **Compress PDF** | Reduce file size with pdf-lib optimisations |
| 🖼️ **Image → PDF** | Convert JPG / PNG / WEBP images to PDF |
| 🔏 **Watermark** | Stamp a custom text watermark on every page |

## Tech Stack

- **Frontend**: React 19, Tailwind CSS 3, react-router-dom, react-dropzone, react-hot-toast, axios  
- **Backend**: Node.js, Express, Multer 2, pdf-lib, Jimp  
- **Security**: Helmet, express-rate-limit, MIME validation, auto file cleanup  

## Quick Start

### 1. Backend

```bash
cd server
cp .env.example .env      # edit as needed
npm install
npm start                 # http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm start                 # http://localhost:3000
```

The CRA dev server proxies `/api/*` to `http://localhost:5000`.

## Project Structure

```
/
├── client/                  # React application
│   ├── public/
│   └── src/
│       ├── api/             # Axios API calls
│       ├── components/      # Reusable UI (DropZone, ProgressBar, DownloadButton)
│       └── pages/           # One page per tool + Dashboard
│
└── server/                  # Node.js / Express API
    ├── controllers/         # Request handlers
    ├── middleware/          # Centralized error handler
    ├── routes/              # Express routers
    ├── services/            # Pure PDF-processing logic
    ├── utils/               # upload config, cleanup scheduler
    └── uploads/             # Temporary file storage (auto-cleaned)
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/upload` | Pre-upload files (optional) |
| POST | `/api/merge` | Merge PDFs (field: `pdfs[]`) |
| POST | `/api/split` | Split PDF (field: `pdf`, body: `startPage`, `endPage`) |
| POST | `/api/compress` | Compress PDF (field: `pdf`) |
| POST | `/api/convert` | Images → PDF (field: `images[]`) |
| POST | `/api/watermark` | Add watermark (field: `pdf`, body: `text`, `fontSize`, `opacity`, `rotation`, `color`) |
| GET  | `/health` | Health check |

All endpoints return `{ downloadUrl: "/files/<filename>" }` on success.

## Security

- **MIME type checking**: only `application/pdf`, `image/jpeg`, `image/png`, `image/webp` are accepted  
- **File size limit**: 50 MB per file (configurable via `MAX_FILE_SIZE` env var)  
- **Auto-cleanup**: uploaded & processed files are deleted after 1 hour  
- **Rate limiting**: 100 requests per 15 minutes per IP  
- **Helmet**: HTTP security headers on all responses  
- **No path exposure**: download URLs use random UUIDs, not original filenames  

## Deployment

### Backend (Render / Railway)

```bash
cd server
npm install --production
npm start
```

Set environment variables: `PORT`, `CLIENT_URL`, `MAX_FILE_SIZE`, `NODE_ENV=production`

### Frontend (Vercel / Netlify)

```bash
cd client
REACT_APP_API_URL=https://your-backend.render.com/api npm run build
# deploy the `build/` directory
```
