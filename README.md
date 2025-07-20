# Nyaysathi

Nyaysathi is a full-stack web application purpose-built for advocates, legal professionals, and law firms to manage their daily operations efficiently. The platform integrates modern legal workflows with AI-enhanced capabilities, offering a seamless digital experience for case tracking, event scheduling, contact management, and intelligent document summarization.
## Features

- **AI PDF Summarizer:** Upload a PDF and receive a detailed, well-formatted summary using an open-source model.
- **Task Management:** Create, view, and manage legal tasks.
- **Event Calendar:** View and manage events with a modern calendar interface.
- **Contact Management:** Store and manage contact information.
- **Dashboard:** Visualize key metrics and reports.

## Project Structure

```
nyaysathi/
  nyaysathi-backend/    # FastAPI backend (AI, API, Cloudinary, MongoDB)
  nyaysathi-frontend/   # Next.js frontend (React, Tailwind CSS)
```

## Getting Started

### Backend Setup
1. **Install dependencies:**
   ```sh
   cd nyaysathi-backend
   pip install -r requirements.txt
   ```
2. **Environment variables:**
   Create a `.env` file in `nyaysathi-backend/` with your Cloudinary credentials:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. **Run the backend:**
   ```sh
   uvicorn main:app --reload
   ```

### Frontend Setup
1. **Install dependencies:**
   ```sh
   cd nyaysathi-frontend
   npm install
   ```
2. **Run the frontend:**
   ```sh
   npm run dev
   ```
3. **Access the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- **AI Summarizer:** Go to the "AI Summarizer" page, upload a PDF, and view the Markdown-formatted summary.
- **Calendar:** View and manage events on the calendar page.
- **Tasks & Contacts:** Manage your legal workflow from the dashboard.

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS, FullCalendar
- **Backend:** FastAPI, Hugging Face Transformers, PyMuPDF, Cloudinary, MongoDB

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
