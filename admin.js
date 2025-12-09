// Admin Panel - Google Drive Integration
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const documentList = document.getElementById('documentsList');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Load existing documents
    loadDocuments();
    
    // Form submission handler - GOOGLE DRIVE VERSION
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('docTitle').value;
        const type = document.getElementById('docType').value;
        const link = document.getElementById('docLink').value;
        const description = document.getElementById('docDescription').value;
        
        if (!title || !type || !link) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Validate Google Drive link
        if (!link.includes('drive.google.com')) {
            if (!confirm('This doesn\'t look like a Google Drive link. Continue anyway?')) {
                return;
            }
        }
        
        const documentData = {
            id: Date.now(),
            title: title,
            type: type,
            link: link,
            description: description || 'No description provided',
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        };
        
        saveDocument(documentData);
        loadDocuments();
        
        // Reset form
        this.reset();
        
        alert('Document added successfully!\n\nIt will now appear on the prospectus page.');
    });
    
    // Function to load documents
    function loadDocuments() {
        loadingSpinner.classList.remove('hidden');
        documentList.innerHTML = '';
        
        setTimeout(() => {
            const documents = getDocuments();
            
            if (documents.length === 0) {
                documentList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-folder-open"></i>
                        <h3>No documents added yet</h3>
                        <p>Add your first document using the form above</p>
                    </div>
                `;
            } else {
                documents.forEach(doc => {
                    const card = createDocumentCard(doc);
                    documentList.appendChild(card);
                });
            }
            
            loadingSpinner.classList.add('hidden');
        }, 500);
    }
    
    // Function to create document card
    function createDocumentCard(doc) {
        const card = document.createElement('div');
        card.className = 'document-card-admin';
        
        card.innerHTML = `
            <div class="doc-info">
                <div class="doc-icon">
                    <i class="fas ${getFileIcon(doc.link)}"></i>
                </div>
                <div class="doc-details">
                    <h4>${doc.title}</h4>
                    <p class="doc-description">${doc.description}</p>
                    <div class="doc-meta">
                        <span class="doc-type">${doc.type}</span>
                        <span class="doc-date">${doc.date}</span>
                    </div>
                    <a href="${doc.link}" target="_blank" class="doc-link">
                        <i class="fas fa-external-link-alt"></i> View on Google Drive
                    </a>
                </div>
            </div>
            <div class="doc-actions">
                <button onclick="editDocument(${doc.id})" class="btn-action edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteDocument(${doc.id})" class="btn-action delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        return card;
    }
    
    // Helper function to get file icon
    function getFileIcon(link) {
        if (link.includes('.pdf')) return 'fa-file-pdf';
        if (link.includes('.doc')) return 'fa-file-word';
        if (link.includes('.xls')) return 'fa-file-excel';
        return 'fa-file';
    }
    
    // LocalStorage functions
    function getDocuments() {
        const docs = localStorage.getItem('lovingHeartsDocuments');
        return docs ? JSON.parse(docs) : [];
    }
    
    window.saveDocument = function(doc) {
        const docs = getDocuments();
        docs.push(doc);
        localStorage.setItem('lovingHeartsDocuments', JSON.stringify(docs));
    };
    
    window.deleteDocument = function(id) {
        if (confirm('Are you sure you want to delete this document?')) {
            let docs = getDocuments();
            docs = docs.filter(doc => doc.id !== id);
            localStorage.setItem('lovingHeartsDocuments', JSON.stringify(docs));
            loadDocuments();
        }
    };
    
    window.editDocument = function(id) {
        const docs = getDocuments();
        const doc = docs.find(d => d.id === id);
        
        if (doc) {
            document.getElementById('docTitle').value = doc.title;
            document.getElementById('docType').value = doc.type;
            document.getElementById('docLink').value = doc.link;
            document.getElementById('docDescription').value = doc.description;
            
            // Remove old document
            deleteDocument(id);
            
            // Scroll to form
            document.getElementById('docTitle').focus();
        }
    };
    
    window.exportDocuments = function() {
        const docs = getDocuments();
        const dataStr = JSON.stringify(docs, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'loving-hearts-documents-backup.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        alert('Documents exported successfully!');
    };
});

// Add admin styles
const adminStyles = `
    .document-card-admin {
        background: white;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        border-left: 4px solid #e91e63;
    }
    
    .doc-info {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        flex: 1;
    }
    
    .doc-icon {
        font-size: 1.5rem;
        color: #e91e63;
        padding: 10px;
        background: #fce4ec;
        border-radius: 8px;
    }
    
    .doc-details h4 {
        margin: 0 0 5px 0;
        color: #333;
    }
    
    .doc-description {
        margin: 0 0 10px 0;
        color: #666;
        font-size: 0.9rem;
    }
    
    .doc-meta {
        display: flex;
        gap: 15px;
        font-size: 0.8rem;
        color: #888;
    }
    
    .doc-type {
        background: #f0f0f0;
        padding: 3px 8px;
        border-radius: 4px;
    }
    
    .doc-link {
        display: inline-block;
        margin-top: 10px;
        color: #7b1fa2;
        text-decoration: none;
        font-size: 0.9rem;
    }
    
    .doc-actions {
        display: flex;
        gap: 10px;
    }
    
    .btn-action {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        transition: all 0.3s;
    }
    
    .btn-action.edit {
        background: #e3f2fd;
        color: #1976d2;
    }
    
    .btn-action.delete {
        background: #ffebee;
        color: #f44336;
    }
    
    .btn-action:hover {
        transform: scale(1.1);
    }
    
    .empty-state {
        text-align: center;
        padding: 40px;
        color: #666;
    }
    
    .empty-state i {
        font-size: 3rem;
        margin-bottom: 20px;
        opacity: 0.5;
    }
    
    .hidden {
        display: none;
    }
`;

// Add styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = adminStyles;
document.head.appendChild(styleSheet);
