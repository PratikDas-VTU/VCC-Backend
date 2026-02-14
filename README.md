VCC – Vibeathon 2026

Official Hackathon Management & Evaluation System
Developed for VEL TECH CYBERCATALYST (VCC) – 2026

📌 Overview

Vibeathon is a full-stack hackathon management platform built to conduct, monitor, and evaluate an internal university hackathon in a secure, structured, and transparent manner.
 The system consists of:
A participant-side submission dashboard
An admin-side evaluation panel
Immutable AI prompt logging
Secure authentication and ranking logic
Controlled evaluation workflows
The platform ensures fairness, auditability, and clean administrative control during the event.

🏗 System Modules
1️⃣ Landing Website
Event introduction
Rules & guidelines
Themes
Navigation to participant & admin login

2️⃣ Participant System

Participants log in using assigned credentials (VCC_ID-based authentication).

Workflow:
Login (Team Authentication)
finalize Team Details
Download Assigned Problem Statement
Live Dashboard 
Prompt Logging (AI usage tracking)
GitHub Repository Submission
Deployment URL Submission

Key Controls:

Backend-controlled session timer
Immutable prompt logging
One active session per team
Submission locking after session end
Valid submission validation logic

3️⃣ Admin Evaluation Panel

A secure internal dashboard for organizers and judges.

Core Features:
JWT-based secure authentication
Live team listing
Filter-based ranking system
AI prompt audit visibility
Immutable data viewing
CSV export support
Non-disruptive auto-refresh
Judge-friendly clean interface

🏆 Evaluation System

Teams can be reviewed using multiple perspectives:
Completion Time
AI Tool Usage
Prompt Activity
Balanced (Combined Logic)
Neutral View (No Sorting)
Final scoring weights are defined by the organizing committee.

✅ Valid Submission Criteria

A team is included in ranked results only if:
Hackathon session is completed
GitHub repository link is submitted
Deployment link is submitted
Teams failing to meet these conditions:
Remain visible for transparency
Are excluded from ranking filters
This ensures fairness and prevents incomplete submissions from influencing results.

🔐 Security Architecture

JWT-based authentication
Protected admin routes
Backend-controlled evaluation logic
Immutable submission storage
Prompt activity logging
No frontend-controlled scoring

🧠 AI Monitoring Integration

The platform includes AI prompt logging to:
Track AI usage per team
Maintain audit transparency
Support evaluation review
The system assists judges but does not replace human evaluation.

🖥 Tech Stack
Frontend

HTML
CSS
Vanilla JavaScript
Backend
Node.js
Express.js

Database
Firease

Authentication
JSON Web Tokens (JWT)
bcrypt password hashing

Deployment
Backend hosted on Render
Render 

📂 Repository Structure (High-Level)
/frontend
  /participant
  /admin
/backend
  /models
  /routes
  /middleware
  /utils

🧪 Current Status

✅ Participant system completed
✅ Admin panel completed
✅ Evaluation filters operational
✅ Prompt logging integrated
🧪 Demo dataset enabled for testing
🧹 Demo credentials will be removed before final event
📥 Final dataset will be inserted after HOD approval

🎯 Intended Usage

This system is built strictly for:

Vibeathon 2026 – VEL TECH CYBERCATALYST (VCC)
Vel Tech University
It is not intended for public commercial deployment.

👨‍💻 Developed For

VEL TECH CYBERCATALYST (VCC)
Vel Tech University
© 2026
