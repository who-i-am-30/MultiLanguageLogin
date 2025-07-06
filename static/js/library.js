let deleteSnippetId = null;
let deleteModal;

document.addEventListener('DOMContentLoaded', function() {
    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    
    // Confirm delete handler
    document.getElementById('confirmDelete').addEventListener('click', function() {
        if (deleteSnippetId) {
            performDelete(deleteSnippetId);
        }
    });
    
    // Truncate long code snippets
    truncateCodePreviews();
});

function updateFilters() {
    const sort = document.getElementById('sortSelect').value;
    const language = document.getElementById('languageFilter').value;
    
    const url = new URL(window.location);
    url.searchParams.set('sort', sort);
    if (language) {
        url.searchParams.set('language', language);
    } else {
        url.searchParams.delete('language');
    }
    
    window.location.href = url.toString();
}

function copyCode(index) {
    const codeElement = document.querySelectorAll('.snippet-code')[index];
    const code = codeElement.textContent;
    
    navigator.clipboard.writeText(code).then(function() {
        showToast('Code copied to clipboard!');
    }).catch(function() {
        // Fallback for browsers that don't support clipboard API
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Code copied to clipboard!');
    });
}

function copyShareLink(shareId) {
    const url = `${window.location.origin}/view/${shareId}`;
    
    navigator.clipboard.writeText(url).then(function() {
        showToast('Share link copied to clipboard!');
    }).catch(function() {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Share link copied to clipboard!');
    });
}

function deleteSnippet(snippetId) {
    deleteSnippetId = snippetId;
    deleteModal.show();
}

function performDelete(snippetId) {
    const formData = new FormData();
    
    fetch(`/delete_snippet/${snippetId}`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            deleteModal.hide();
            // Remove the snippet card from the DOM
            const snippetCard = document.querySelector(`[onclick="deleteSnippet(${snippetId})"]`).closest('.col-lg-6, .col-xl-4');
            snippetCard.remove();
            
            showToast('Snippet deleted successfully!');
            
            // Check if there are no more snippets
            if (document.querySelectorAll('.snippet-card').length === 0) {
                location.reload();
            }
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to delete snippet. Please try again.');
    })
    .finally(() => {
        deleteSnippetId = null;
    });
}

function truncateCodePreviews() {
    const codePreviews = document.querySelectorAll('.code-preview pre');
    
    codePreviews.forEach(preview => {
        const lines = preview.textContent.split('\n');
        if (lines.length > 10) {
            const truncated = lines.slice(0, 10).join('\n') + '\n...';
            preview.textContent = truncated;
        }
        
        // Limit character length per line
        const maxLineLength = 50;
        const processedLines = preview.textContent.split('\n').map(line => {
            if (line.length > maxLineLength) {
                return line.substring(0, maxLineLength) + '...';
            }
            return line;
        });
        
        preview.textContent = processedLines.join('\n');
    });
}

function showToast(message) {
    // Create toast if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    const toastElement = document.createElement('div');
    toastElement.className = 'toast';
    toastElement.innerHTML = `
        <div class="toast-header">
            <i class="fas fa-check-circle text-success me-2"></i>
            <strong class="me-auto">Success</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    toastContainer.appendChild(toastElement);
    
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}

// Search functionality (client-side)
function searchSnippets() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const snippetCards = document.querySelectorAll('.snippet-card');
    
    snippetCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const code = card.querySelector('.snippet-code').textContent.toLowerCase();
        const language = card.querySelector('.badge').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                       code.includes(searchTerm) || 
                       language.includes(searchTerm);
        
        const container = card.closest('.col-lg-6, .col-xl-4');
        container.style.display = matches ? 'block' : 'none';
    });
}

// Add search input if it doesn't exist
document.addEventListener('DOMContentLoaded', function() {
    const filtersRow = document.querySelector('.row.mb-4');
    if (filtersRow && !document.getElementById('searchInput')) {
        const searchCol = document.createElement('div');
        searchCol.className = 'col-md-12 mt-3';
        searchCol.innerHTML = `
            <label for="searchInput" class="form-label">Search</label>
            <input type="text" class="form-control" id="searchInput" placeholder="Search snippets..." oninput="searchSnippets()">
        `;
        filtersRow.appendChild(searchCol);
    }
});
