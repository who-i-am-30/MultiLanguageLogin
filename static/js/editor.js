let editor;
let saveModal;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize CodeMirror
    editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
        mode: 'text/javascript',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        lineWrapping: true,
        extraKeys: {
            "Ctrl-S": function() { document.getElementById('saveBtn').click(); },
            "Cmd-S": function() { document.getElementById('saveBtn').click(); }
        }
    });
    
    // Set editor size
    editor.setSize(null, '100%');
    
    // Initialize modal
    saveModal = new bootstrap.Modal(document.getElementById('saveModal'));
    
    // Language change handler
    document.getElementById('languageSelect').addEventListener('change', function() {
        const mode = getCodeMirrorMode(this.value);
        editor.setOption('mode', mode);
    });
    
    // Save button handler
    document.getElementById('saveBtn').addEventListener('click', function() {
        const title = document.getElementById('snippetTitle').value.trim();
        const language = document.getElementById('languageSelect').value;
        const code = editor.getValue().trim();
        
        if (!title) {
            alert('Please enter a snippet name');
            document.getElementById('snippetTitle').focus();
            return;
        }
        
        if (!code) {
            alert('Please enter some code');
            editor.focus();
            return;
        }
        
        // Show confirmation modal
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalLanguage').textContent = language;
        saveModal.show();
    });
    
    // Confirm save handler
    document.getElementById('confirmSave').addEventListener('click', function() {
        saveSnippet();
    });
});

function getCodeMirrorMode(language) {
    const modeMap = {
        'javascript': 'text/javascript',
        'typescript': 'text/typescript',
        'python': 'text/x-python',
        'java': 'text/x-java',
        'cpp': 'text/x-c++src',
        'c': 'text/x-csrc',
        'csharp': 'text/x-csharp',
        'php': 'text/x-php',
        'ruby': 'text/x-ruby',
        'go': 'text/x-go',
        'rust': 'text/x-rustsrc',
        'swift': 'text/x-swift',
        'kotlin': 'text/x-kotlin',
        'html': 'text/html',
        'css': 'text/css',
        'sql': 'text/x-sql',
        'shell': 'text/x-sh',
        'yaml': 'text/x-yaml',
        'json': 'application/json',
        'xml': 'text/xml'
    };
    
    return modeMap[language] || 'text/plain';
}

function saveSnippet() {
    const title = document.getElementById('snippetTitle').value.trim();
    const language = document.getElementById('languageSelect').value;
    const code = editor.getValue().trim();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('language', language);
    formData.append('code', code);
    
    // Disable save button
    const saveBtn = document.getElementById('confirmSave');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...';
    saveBtn.disabled = true;
    
    fetch('/save_snippet', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Close modal
            saveModal.hide();
            
            // Show success message
            const alert = document.createElement('div');
            alert.className = 'alert alert-success alert-dismissible fade show';
            alert.innerHTML = `
                <i class="fas fa-check-circle me-2"></i>${data.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            
            document.querySelector('.container-fluid').insertBefore(alert, document.querySelector('.row'));
            
            // Clear form
            document.getElementById('snippetTitle').value = '';
            editor.setValue('');
            
            // Auto-hide alert after 3 seconds
            setTimeout(() => {
                alert.remove();
            }, 3000);
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to save snippet. Please try again.');
    })
    .finally(() => {
        // Re-enable save button
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    });
}

// Auto-save functionality (optional)
let autoSaveTimer;
function initializeAutoSave() {
    if (editor) {
        editor.on('change', function() {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                // Could implement auto-save to localStorage here
                const title = document.getElementById('snippetTitle').value.trim();
                if (title && editor.getValue().trim()) {
                    localStorage.setItem('editor_draft', JSON.stringify({
                        title: title,
                        language: document.getElementById('languageSelect').value,
                        code: editor.getValue(),
                        timestamp: Date.now()
                    }));
                }
            }, 1000);
        });
    }
}

// Initialize auto-save after editor is ready
setTimeout(initializeAutoSave, 100);

// Load draft on page load
window.addEventListener('load', function() {
    const draft = localStorage.getItem('editor_draft');
    if (draft) {
        try {
            const data = JSON.parse(draft);
            // Only load if less than 24 hours old
            if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                document.getElementById('snippetTitle').value = data.title;
                document.getElementById('languageSelect').value = data.language;
                editor.setValue(data.code);
                
                // Trigger language change
                document.getElementById('languageSelect').dispatchEvent(new Event('change'));
            }
        } catch (e) {
            console.error('Error loading draft:', e);
        }
    }
});
