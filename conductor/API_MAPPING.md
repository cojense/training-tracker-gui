# API and View Mapping

This document provides a reference for mapping legacy Flask Web UI routes to the modern React frontend views and their underlying API endpoints.

## Core Services
| Service | Local Dev URL | Production URL |
| :--- | :--- | :--- |
| **Backend API** | `http://localhost:5001` | `https://api.training.shyftsolutions.io` |
| **React UI** | `http://localhost:5173` | `https://training.shyftsolutions.io` |

## Route Mapping

### Training Management
| Feature | Flask Web Route | React View Route | Backend API Endpoint |
| :--- | :--- | :--- | :--- |
| Training List | `/training` | `/trainings` | `GET /api/trainings` |
| Training Detail | `/training/<id>` | `/training/:id` | `GET /api/trainings/:id` |
| Completion History | (Inline in detail) | (Inline in detail) | `GET /api/trainings/:id/completions` |
| Create Training | `/training/create` | `/training/new` | `POST /api/trainings` |
| Edit Training | `/training/<id>/edit` | `/training/:id/edit` | `PUT /api/trainings/:id` |

### User Reports & Records
| Feature | Flask Web Route | React View Route | Backend API Endpoint |
| :--- | :--- | :--- | :--- |
| Manager Report | `/reports/manager` | `/manager-report` | `GET /api/reports/manager` |
| Supervisor Report | `/reports/supervisor` | `/supervisor` | `GET /api/reports/supervisor` |
| Record Event | `/event/record` | `/events/record` | `POST /api/events` |
| Approval Queue | `/unapproved_training` | `/approval` | `GET /api/approvals` |

## Environment Variables

### Backend (`training-tracker/.env`)
- `BACKEND_PORT`: Default `5001`.
- `CORS_ALLOWED_ORIGINS`: Comma-separated list (e.g., `http://localhost:5173`).
- `USE_S3_STORAGE`: Set to `true` to enable AWS S3 for certificates.
- `AWS_DEFAULT_REGION`: AWS region for S3 (e.g., `us-east-2`).
- `CERTIFICATE_BUCKET`: S3 bucket name for storage.

### Frontend (`training-tracker-gui/.env`)
- `VITE_API_BASE_URL`: Full URL to the API (e.g., `http://localhost:5001/api`).
- `VITE_BACKEND_URL`: Base URL for redirects (e.g., `http://localhost:5001`).
