# BITS Gate Entry-Exit System

A robust, modern web application for managing visitor entry and exit at institutional gates. This system enables guards and administrators to register visitors, track their movements, print QR-coded passes, and monitor all activity through a secure, user-friendly dashboard.

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [How It Works](#how-it-works)
- [Setup & Deployment](#setup--deployment)
- [Component Summary](#component-summary)

## Project Overview

This project is a comprehensive visitor management solution tailored for campus security and administrative needs. It allows for:

- **Visitor Registration:** Capture visitor details, purpose, vehicle info, and generate unique entry IDs.
- **QR Code Passes:** Instantly generate and print QR-coded entry-exit passes using a thermal printer.
- **Real-Time Tracking:** Monitor all visitors currently inside the campus and maintain a searchable log of all entries and exits.
- **Role-Based Access:** Separate panels and permissions for guards and administrators.
- **Secure Authentication:** JWT-based login and session management for all users.
- **Data Analytics:** Export visitor and guard activity logs for reporting and analysis.

## Key Features

- **Modern React Frontend:** Responsive UI for guards and admins, with real-time search, data tables, and Excel export.
- **Flask REST API Backend:** Handles authentication, session tracking, entry/exit logic, and database operations.
- **MongoDB Integration:** Stores all visitor, user, and session data with efficient querying and pagination.
- **QR Code Generation:** Each entry generates a unique QR code for quick verification and exit processing.
- **Thermal Printer Support:** Print passes directly from the web app to a connected thermal printer.
- **Role-Based Dashboards:** Guards can add entries and mark exits; admins can view all data, reset passwords, and audit guard activity.
- **Advanced Search:** Search visitors by name, contact, ID, or date, including those currently inside.
- **Session & Activity Logs:** Track guard/admin login/logout times and IP addresses for security auditing.
- **Password Reset:** Admins can reset passwords for guards and other admins securely.

## System Architecture

- **Frontend:** React (Chakra UI, Framer Motion, XLSX export), organized into modular components for forms, tables, dashboards, and authentication.
- **Backend:** Flask REST API with JWT authentication, MongoDB for persistent storage, and Python dataclasses for data modeling.
- **Thermal Printer Integration:** Python ESC/POS library for direct USB printing of passes.
- **QR Code Generation:** Python qrcode and Pillow libraries for image creation and formatting.
- **Session Management:** JWT tokens and MongoDB session logs for secure, auditable access.

## How It Works

1. **Login & Authentication:** Guards and admins log in via the web interface. JWT tokens secure all API requests.
2. **Visitor Entry:** Guards fill out a form with visitor details. The backend generates a unique entry ID and QR code, stores the record, and prints a pass.
3. **Marking Exit:** Visitors can be marked as exited by contact number, entry ID, vehicle number, or QR code scan. The system updates the record with exit time.
4. **Live Monitoring:** Admins and guards can view all current visitors inside the campus and search historical records.
5. **Admin Functions:** Admins can reset passwords, view guard activity logs, and export data for reporting.
6. **Printing:** Passes are printed with all details and a QR code for easy verification at the gate.

## Setup & Deployment

### Prerequisites

- **Python 3.8+**
- **Node.js 14+**
- **MongoDB (local or Atlas cloud)**
- **Thermal Printer (ESC/POS compatible, USB)**
- **(Optional) Ngrok for public tunneling**

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. **Configure MongoDB URI:**
   - Set the `MONGO_URI` environment variable or edit the default in `database.py`.
3. **Run the Flask server:**
   ```bash
   python main.py
   ```
4. **(Optional) Start the thermal printer server:**
   ```bash
   python thermal_printer.py
   ```

### Frontend Setup

1. **Install Node dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Start the React app:**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`.

### Printing Passes

- Ensure the thermal printer is connected and configured.
- The backend's `thermal_printer.py` listens on port 9999 for print commands from the frontend.

## Component Summary

| Component         | Description                                                      |
|-------------------|------------------------------------------------------------------|
| **backend/collection_format.py** | Data models for visitors, users, and sessions     |
| **backend/database.py**          | All database operations and business logic        |
| **backend/main.py**              | Flask API endpoints and session management        |
| **backend/thermal_printer.py**   | Local server for printing passes via USB printer  |
| **frontend/src/components/**     | React components for forms, tables, dashboards    |
| **frontend/src/styles/**         | CSS for all UI components                        |
| **MongoDB**                      | Persistent storage for all records                |
