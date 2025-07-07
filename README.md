# CodeVault - Multi-Language Code Library Platform

A comprehensive Flask-based web application for storing, organizing, and sharing code snippets with syntax highlighting and dual authentication methods.

## Features

- **Dual Authentication System**: 
  - Full login with email and password
  - Quick access with 5-digit user ID and password
- **Code Editor**: Full-screen CodeMirror editor with syntax highlighting
- **Multi-Language Support**: JavaScript, Python, Java, C++, HTML, CSS, SQL, and more
- **Personal Library**: Organize and manage your code snippets
- **Sharing**: Generate unique URLs to share snippets publicly
- **Custom Design**: Beautiful interface with custom color palette
- **Database**: PostgreSQL for production-ready scalability

## Technology Stack

- **Backend**: Flask (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Frontend**: Bootstrap 5, CodeMirror, Font Awesome
- **Authentication**: Session-based with password hashing
- **Deployment**: Gunicorn WSGI server

## Project Structure

```
CodeVault/
├── app.py              # Flask application configuration
├── main.py             # Application entry point
├── models.py           # Database models (User, CodeSnippet)
├── routes.py           # URL routes and view functions
├── templates/          # Jinja2 HTML templates
│   ├── base.html
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── editor.html
│   ├── library.html
│   └── view_snippet.html
├── static/
│   ├── css/
│   │   └── style.css   # Custom styling
│   └── js/
│       ├── editor.js   # Code editor functionality
│       └── library.js  # Library management
└── requirements.txt    # Python dependencies
```

## Setting Up in PyCharm

### Prerequisites

1. **Python 3.8+** installed on your system
2. **PostgreSQL** database server
3. **PyCharm Professional or Community Edition**
4. **Git** (optional, for version control)

### Step 1: Clone or Download the Project

```bash
# Option 1: Clone from repository
git clone <repository-url>
cd CodeVault

# Option 2: Download and extract the project files
```

### Step 2: Open Project in PyCharm

1. Open PyCharm
2. Click **"Open"** or **"File" → "Open"**
3. Navigate to your CodeVault project folder
4. Click **"OK"** to open the project

### Step 3: Create Virtual Environment

1. In PyCharm, go to **"File" → "Settings"** (or **"PyCharm" → "Preferences"** on macOS)
2. Navigate to **"Project: CodeVault" → "Python Interpreter"**
3. Click the gear icon and select **"Add..."**
4. Choose **"Virtualenv Environment"**
5. Select **"New environment"**
6. Choose Python 3.8+ as the base interpreter
7. Click **"OK"**

### Step 4: Install Dependencies

1. Open the terminal in PyCharm (**"View" → "Tool Windows" → "Terminal"**)
2. Ensure your virtual environment is activated (you should see the env name in prompt)
3. Install required packages:

```bash
pip install flask flask-sqlalchemy gunicorn psycopg2-binary sqlalchemy werkzeug email-validator
```

### Step 5: Set Up PostgreSQL Database

#### Option A: Local PostgreSQL Installation

1. Install PostgreSQL on your system
2. Create a new database:
```sql
CREATE DATABASE codevault;
CREATE USER codevault_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE codevault TO codevault_user;
```

#### Option B: Using Docker (Recommended)

```bash
# Run PostgreSQL in Docker
docker run --name codevault-db \
  -e POSTGRES_DB=codevault \
  -e POSTGRES_USER=codevault_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:13
```

### Step 6: Configure Environment Variables

1. Create a `.env` file in your project root:

```env
DATABASE_URL=postgresql://codevault_user:your_password@localhost:5432/codevault
SESSION_SECRET=your-secret-key-here
FLASK_ENV=development
FLASK_DEBUG=True
```

2. In PyCharm, set up environment variables:
   - Go to **"Run" → "Edit Configurations"**
   - Select your Python configuration or create a new one
   - In **"Environment variables"**, add the variables from `.env`

### Step 7: Configure PyCharm Run Configuration

1. Go to **"Run" → "Edit Configurations"**
2. Click the **"+"** and select **"Python"**
3. Configure:
   - **Name**: CodeVault
   - **Script path**: Point to `main.py`
   - **Parameters**: (leave empty)
   - **Environment variables**: Add your database URL and session secret
   - **Python interpreter**: Select your virtual environment
   - **Working directory**: Your project root

### Step 8: Initialize Database

1. Open PyCharm's Python Console (**"Tools" → "Python Console"**)
2. Run the following commands:

```python
from app import app, db
with app.app_context():
    db.create_all()
    print("Database tables created successfully!")
```

### Step 9: Run the Application

1. Click the **"Run"** button in PyCharm (or press **Shift+F10**)
2. The application will start on `http://localhost:5000`
3. Open your browser and navigate to the URL

### Step 10: Development Tips

#### Debugging in PyCharm
- Set breakpoints by clicking on line numbers
- Use **"Debug"** instead of **"Run"** for step-by-step debugging
- Use the Variables panel to inspect values

#### Database Management
- Install PyCharm's Database Tools plugin
- Connect to your PostgreSQL database for visual management
- View tables, run queries, and manage data directly in PyCharm

#### Code Navigation
- Use **Ctrl+Click** (or **Cmd+Click** on macOS) to navigate to function definitions
- **Ctrl+Shift+F** for global search
- **Ctrl+R** for find and replace

## Usage Guide

### User Registration
1. Visit the homepage
2. Click **"Get Started"**
3. Fill in your email and password
4. You'll receive a unique 5-digit ID for quick access

### Creating Code Snippets
1. Log in to your account
2. Click **"Editor"** in the navigation
3. Write your code with syntax highlighting
4. Add a title and select the programming language
5. Click **"Save Snippet"**

### Managing Your Library
1. Click **"Library"** to view all your snippets
2. Filter by programming language
3. Search through your code
4. Copy code or share links with others

### Sharing Snippets
1. In your library, click the share button on any snippet
2. Copy the generated URL
3. Share the link - others can view the code without needing an account

## Troubleshooting

### Common Issues

**Database Connection Error**
- Verify PostgreSQL is running
- Check your DATABASE_URL environment variable
- Ensure database credentials are correct

**Import Errors**
- Verify all dependencies are installed in your virtual environment
- Check that PyCharm is using the correct interpreter

**Port Already in Use**
- Change the port in `main.py` if 5000 is occupied
- Or kill the process using port 5000

**CSS/JS Not Loading**
- Ensure static files are in the correct directory
- Check browser console for 404 errors
- Verify Flask is serving static files correctly

### Development Mode
For development, you can also run directly from terminal:

```bash
# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Set environment variables
export FLASK_ENV=development
export FLASK_DEBUG=True

# Run the application
python main.py
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review PyCharm documentation for IDE-specific issues
3. Check Flask documentation for framework-related questions