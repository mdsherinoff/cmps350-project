# Course Management System

This README.md is an in-depth review into our university project for Web Development. One of the best experiences me and my team ever had with such a time-intensive schedule of a semester. Nevertheless will not trade it for anything.

This is a full-stack course management system built with Next.js that enables instructors, students, and administrators to manage courses, enrollments, schedules, and academic reporting.

## Features
- **Role-Based Access Control**: Three user roles with different permissions and pages
  - **Students**: View enrolled courses, check progress, access learning materials
  - **Instructors**: Create and manage courses, sections, and view student reports
  - **Administrators**: System-wide management, user management, and reporting

- **Course Management**: Create courses with prerequisites, credits, and descriptions
- **Section Management**: Organize courses into sections with open/closed status
- **Enrollment System**: Track student enrollments with status (pending, current, completed)
- **Reporting & Analytics**: Generate reports for courses, instructors, and students with visual charts
- **Authentication**: Secure JWT-based authentication with NextAuth integration
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations

## Tech Stack
- **Frontend**: React 19, Next.js 15 (App Router)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: CSS Modules, Font Awesome Icons
- **Data Visualization**: Chart.js with react-chartjs-2
- **Backend Services**: Supabase
- **Language**: JavaScript/TypeScript

## Prerequisites
- Node.js 18+
- npm or yarn package manager
- PostgreSQL database
- Supabase account

## Project Structure
```
app/
├── api/                    # API endpoints
│   ├── auth/               # Authentication routes
│   ├── courses/            # Course management endpoints
│   ├── enrollments/        # Enrollment endpoints
│   ├── instructors/        # Instructor endpoints
│   ├── sections/           # Section endpoints
│   ├── students/           # Student endpoints
│   └── users/              # User management endpoints
├── components/             # Reusable React components
│   ├── CourseReport.jsx
│   ├── InstructorReport.jsx
│   └── StudentReport.jsx
├── actions/                # Server actions
├── lib/                    # Utility functions
│   └── jwt.js              # JWT utilities
├── login/                  # Authentication pages
├── informationPage/        # Information pages
├── data/                   # Static JSON data files
└── repo/                   # Data repository layer
    ├── courses-repo.js
    ├── instructors-repo.js
    ├── students-repo.js
    ├── users-repo.js
    └── master-repo.js

prisma/
├── schema.prisma           # Database schema
├── migrations/             # Database migrations
└── seeding/
    └── seed.js             # Database seed script

public/
├── html/                   # Static HTML pages
├── css/                    # Stylesheets
├── js/                     # Client-side scripts
├── images/                 # Image assets
└── data/                   # Public data files
```

## Database Schema Overview

### Core Models

**User**
- Represents system users with role-based access
- Roles: STUDENT, INSTRUCTOR, ADMIN
- Related to Student or Instructor profiles

**Student**
- Student profile linked to User
- Tracks studentUId, name, year
- Has many Enrollments

**Instructor**
- Instructor profile linked to User
- Tracks instructorUId, name, department
- Teaches many Sections

**Course**
- Core course entity
- Properties: code, name, credits, category, prerequisites
- Has many Sections
- Supports prerequisites

**Section**
- Represents course offerings
- Status: OPEN, CLOSED
- Taught by an Instructor
- Has many Enrollments

**Enrollment**
- Represents student enrollment in sections
- Status: PENDING, CURRENT, COMPLETED
- Links Student to Section

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/[...nextauth]` - NextAuth routes

### Courses
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create new course
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Students
- `GET /api/students` - List all students
- `POST /api/students` - Create new student
- `GET /api/students/:id` - Get student details

### Instructors
- `GET /api/instructors` - List all instructors
- `POST /api/instructors` - Create new instructor
- `GET /api/instructors/:id` - Get instructor details

### Sections
- `GET /api/sections` - List all sections
- `POST /api/sections` - Create new section
- `PUT /api/sections/:id` - Update section status

### Enrollments
- `GET /api/enrollments` - List enrollments
- `POST /api/enrollments` - Create enrollment
- `PUT /api/enrollments/:id` - Update enrollment status

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create new user

## User Roles & Permissions

### Student
- View enrolled courses and sections
- Check enrollment status
- Access learning materials
- View personal reports

### Instructor
- Create and manage courses
- Create and manage sections
- View student reports
- Check enrollment statistics

### Administrator
- Full system access
- User management
- Course and section management
- System-wide reporting and analytics

## Development Notes
- **Authentication**: Uses JWT tokens stored in cookies via NextAuth
- **Database Migrations**: Use Prisma migrations for schema changes
- **Type Safety**: TypeScript configuration available for enhanced development
- **API Errors**: Implement consistent error handling across all endpoints
- **CORS**: Configured in `app/cors.js` for cross-origin requests

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Support
For issues or questions, please open an issue in the repository or contact the development team.
