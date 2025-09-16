# YouTube to MP3 Converter Backend

A Node.js/Express backend service for converting YouTube videos to MP3 format using yt-dlp.

## Features

- YouTube video to MP3 conversion
- Video metadata extraction
- Progress tracking
- File cleanup service
- Rate limiting and security
- CORS support
- TypeScript support

## Prerequisites

- Node.js 18+ 
- yt-dlp installed globally: `pip install yt-dlp`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env` as needed.

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm start
```

## API Endpoints

### POST /api/convert
Convert YouTube video to MP3
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "quality": "320"
}
```

### GET /api/status/:jobId
Get conversion status

### GET /api/download/:fileId
Download converted MP3 file

### POST /api/metadata
Get video metadata
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

## Deployment

### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy

### Render
1. Create new web service
2. Connect repository
3. Set build command: `npm run build`
4. Set start command: `npm start`

### Heroku
1. Create new app
2. Set buildpacks: `heroku/nodejs` and Python (for yt-dlp)
3. Deploy

## Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: Frontend URL for CORS
- `TEMP_DIR`: Temporary file directory
- `CLEANUP_INTERVAL`: File cleanup interval in ms
- `MAX_FILE_AGE`: Maximum file age before cleanup
- `RATE_LIMIT_WINDOW`: Rate limiting window
- `RATE_LIMIT_MAX`: Maximum requests per window