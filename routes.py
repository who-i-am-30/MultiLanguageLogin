from flask import render_template, request, redirect, url_for, session, flash, jsonify
from app import app, db
from models import User, CodeSnippet

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        if not username or not email or not password:
            flash('Username, email and password are required', 'error')
            return render_template('register.html')
        
        # Check if email already exists
        if User.query.filter_by(email=email).first():
            flash('Email already registered', 'error')
            return render_template('register.html')
        
        # Generate unique 5-digit ID
        user_id = User.generate_unique_id()
        
        # Create new user
        user = User(user_id=user_id, username=username, email=email)
        user.set_password(password)
        
        try:
            db.session.add(user)
            db.session.commit()
            flash(f'Registration successful! Your unique ID is: {user_id}. Use your email for full login or this ID for quick access.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            db.session.rollback()
            flash('Registration failed. Please try again.', 'error')
            app.logger.error(f"Registration error: {e}")
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        login_type = request.form['login_type']
        password = request.form.get('password', '')
        
        user = None
        
        if login_type == 'full':
            # Full login with email and password
            email = request.form['email']
            if not email or not password:
                flash('Email and password are required for full login', 'error')
                return render_template('login.html')
            
            user = User.query.filter_by(email=email).first()
            if not user:
                flash('Invalid email address', 'error')
                return render_template('login.html')
            
            if user.check_password(password):
                session['user_id'] = user.id
                session['username'] = user.username
                session['user_email'] = user.email
                session['login_type'] = 'full'
                flash('Full login successful!', 'success')
                return redirect(url_for('editor'))
            else:
                flash('Invalid password', 'error')
                
        elif login_type == 'temp':
            # Quick login with 5-digit ID and password
            user_id = request.form['user_id']
            if not user_id or not password:
                flash('5-digit ID and password are required for quick access', 'error')
                return render_template('login.html')
            
            user = User.query.filter_by(user_id=user_id).first()
            if not user:
                flash('Invalid 5-digit ID', 'error')
                return render_template('login.html')
            
            if user.check_password(password):
                session['user_id'] = user.id
                session['username'] = user.username
                session['login_type'] = 'temp'
                flash('Quick access successful!', 'success')
                return redirect(url_for('editor'))
            else:
                flash('Invalid password', 'error')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully', 'success')
    return redirect(url_for('index'))

@app.route('/editor')
def editor():
    if 'user_id' not in session:
        flash('Please login to access the editor', 'error')
        return redirect(url_for('login'))
    
    return render_template('editor.html')

@app.route('/save_snippet', methods=['POST'])
def save_snippet():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    title = request.form['title']
    language = request.form['language']
    code = request.form['code']
    
    if not all([title, language, code]):
        return jsonify({'error': 'All fields are required'}), 400
    
    snippet = CodeSnippet(
        title=title,
        language=language,
        code=code,
        share_id=CodeSnippet.generate_share_id(),
        user_id=session['user_id']
    )
    
    try:
        db.session.add(snippet)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Snippet saved successfully'})
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Save snippet error: {e}")
        return jsonify({'error': 'Failed to save snippet'}), 500

@app.route('/library')
def library():
    if 'user_id' not in session:
        flash('Please login to access your library', 'error')
        return redirect(url_for('login'))
    
    sort_by = request.args.get('sort', 'created_at')
    filter_lang = request.args.get('language', '')
    
    query = CodeSnippet.query.filter_by(user_id=session['user_id'])
    
    if filter_lang:
        query = query.filter_by(language=filter_lang)
    
    if sort_by == 'title':
        query = query.order_by(CodeSnippet.title)
    elif sort_by == 'language':
        query = query.order_by(CodeSnippet.language)
    else:
        query = query.order_by(CodeSnippet.created_at.desc())
    
    snippets = query.all()
    
    # Get unique languages for filter dropdown
    languages = db.session.query(CodeSnippet.language).filter_by(user_id=session['user_id']).distinct().all()
    languages = [lang[0] for lang in languages]
    
    return render_template('library.html', snippets=snippets, languages=languages, 
                         current_sort=sort_by, current_filter=filter_lang)

@app.route('/view/<share_id>')
def view_snippet(share_id):
    snippet = CodeSnippet.query.filter_by(share_id=share_id).first_or_404()
    return render_template('view_snippet.html', snippet=snippet)

@app.route('/delete_snippet/<int:snippet_id>', methods=['POST'])
def delete_snippet(snippet_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    snippet = CodeSnippet.query.filter_by(id=snippet_id, user_id=session['user_id']).first()
    
    if not snippet:
        return jsonify({'error': 'Snippet not found'}), 404
    
    try:
        db.session.delete(snippet)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Delete snippet error: {e}")
        return jsonify({'error': 'Failed to delete snippet'}), 500
