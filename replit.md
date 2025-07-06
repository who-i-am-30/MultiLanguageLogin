# Code Library Application

## Overview

This is a Flask-based web application that allows users to store, organize, and share code snippets with syntax highlighting. Users can register with unique 5-digit IDs, create and save code snippets in various programming languages, and share them via unique links. The application focuses on storage and sharing rather than code execution.

## System Architecture

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: Session-based with password hashing using Werkzeug
- **Data Models**: User and CodeSnippet models with foreign key relationships

### Frontend Architecture
- **Template Engine**: Jinja2 (Flask's default)
- **CSS Framework**: Bootstrap 5 with dark theme
- **Code Editor**: CodeMirror for syntax highlighting
- **Icons**: Font Awesome
- **JavaScript**: Vanilla JS for client-side interactions

### Database Schema
- **Users Table**: Stores user credentials with unique 5-digit IDs and email addresses
- **Code Snippets Table**: Stores code with metadata and sharing capabilities
- **Relationships**: One-to-many between Users and CodeSnippets
- **Database**: PostgreSQL for production-ready reliability and scalability

## Key Components

### Authentication System
- **User Registration**: Generates unique 5-digit user IDs automatically with email addresses
- **Login Options**: Full login (email + password) and quick login (5-digit ID + password)
- **Password Security**: Both login methods require password authentication using Werkzeug's hashing
- **Session Management**: Flask sessions for maintaining user state
- **Two-Tier Interface**: Email-based full interface and ID-based streamlined interface

### Code Management
- **Code Editor**: Full-screen CodeMirror editor with syntax highlighting
- **Language Support**: Multiple programming languages (JavaScript, Python, Java, C++, etc.)
- **Storage**: Snippets saved with title, language, and creation timestamp
- **Sharing**: Unique 16-character share IDs for public access

### User Interface
- **Responsive Design**: Bootstrap-based responsive layout
- **Dark Theme**: Consistent dark theme across all components
- **Navigation**: Context-aware navigation bar
- **Code Visualization**: Syntax-highlighted code previews and full views

## Data Flow

1. **User Registration/Login**: Users create accounts with auto-generated 5-digit IDs or log in with existing credentials
2. **Code Creation**: Users access the editor, write code with syntax highlighting, and save snippets with metadata
3. **Library Management**: Users view their saved snippets in a sortable, filterable library interface
4. **Code Sharing**: Snippets can be shared via unique URLs that allow public read-only access
5. **Data Persistence**: All data is stored in SQLite database with proper relationship management

## External Dependencies

### Frontend Libraries
- **Bootstrap 5**: UI framework with dark theme support
- **CodeMirror**: Code editor with syntax highlighting
- **Font Awesome**: Icon library for UI elements

### Backend Libraries
- **Flask**: Web framework
- **Flask-SQLAlchemy**: Database ORM
- **Werkzeug**: Password hashing and security utilities

### CDN Resources
- Bootstrap CSS and JS from CDN
- CodeMirror from CDNJS
- Font Awesome from CDNJS

## Deployment Strategy

### Development Setup
- **Entry Point**: `main.py` runs the Flask application
- **Configuration**: Environment-based configuration with development defaults
- **Database**: SQLite file-based database with automatic table creation
- **Debug Mode**: Enabled for development with detailed error logging

### Production Considerations
- Secret key should be set via environment variable
- Database connection pooling configured for better performance
- Logging configured for production monitoring
- HTTPS recommended for password security

### File Structure
```
├── app.py              # Flask application factory and configuration
├── main.py             # Application entry point
├── models.py           # Database models (User, CodeSnippet)
├── routes.py           # URL routes and view functions
├── templates/          # Jinja2 HTML templates
├── static/            # CSS, JavaScript, and other static assets
└── code_library.db    # SQLite database file
```

## Changelog
- July 06, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.