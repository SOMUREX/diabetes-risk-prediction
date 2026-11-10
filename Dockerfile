FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend files and pre-built frontend distribution
COPY backend/ ./backend/
COPY frontend/dist/ ./frontend/dist/

# Set working directory to backend
WORKDIR /app/backend

# Default port
ENV PORT=8000

# Expose port
EXPOSE 8000

# Run uvicorn on 0.0.0.0 with dynamic $PORT support
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}

