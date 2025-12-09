// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileName = document.getElementById('fileName');
    const documentList = document.getElementById('documentList');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // File upload area click handler
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // File input change handler
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            fileName.textContent = e.target.files[0].name;
        }
    });
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.backgroundColor = '#fce4ec';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.style.backgroundColor = '';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.backgroundColor = '';
        
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            fileName.textContent = e.dataTransfer.files[0].name;
        }
    });
    
    // Load existing documents
    loadDocuments();
    
    // Form submission handler
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('documentTitle').value;
        const type = document.getElementById('documentType').value;
        const file = fileInput.files[0];
        
        if (!title || !type || !file) {
            alert('Please fill in all fields and select a file.');
            return;
        }
        
        // In a real application, this would upload to a server
        // For this demo, we'll simulate with localStorage
        const documentData = {
            id: Date.now(),
            title: title,
            type: type,
            fileName: file.name,
            fileSize: file.size,
            uploadDate: new Date().toLocaleDateString(),
            // In reality, you would upload the file and store the URL
            fileUrl: '#'
        };
        
        // Save to localStorage
        saveDocument(documentData);
        
        // Reset form
        uploadForm.reset();
        fileName.textContent = 'No file selected';
        
        // Refresh document list
        loadDocuments();
        
        alert('Document uploaded successfully!');
    });
    
    // Function to load documents
    function loadDocuments() {
        loadingSpinner.classList.remove('hidden');
        documentList.innerHTML = '';
        
        // Simulate API call delay
        setTimeout(() => {
            const documents = getDocuments();
            
            if (documents.length === 0) {
                documentList.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 20px;"></i>
                        <p>No documents uploaded yet</p>
                    </div>
                `;
            } else {
                documents.forEach(doc => {
                    const docCard = createDocumentCard(doc);
                    documentList.appendChild(docCard);
                });
            }
            
            loadingSpinner.classList.add('hidden');
        }, 500);
    }
    
    // Function to create document card
    function createDocumentCard(doc) {
        const card = document.createElement('div');
        card.className = 'file-item';
        
        const fileIcon = getFileIcon(doc.fileName);
        const fileSize = formatFileSize(doc.fileSize);
        
        card.innerHTML = `
            <div class="file-info">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas ${fileIcon}" style="color: #e91e63; font-size: 1.2rem;"></i>
                    <div>
                        <strong>${doc.title}</strong>
                        <div style="font-size: 0.8rem; color: #666;">
                            ${doc.type} • ${fileSize} • ${doc.uploadDate}
                        </div>
                    </div>
                </div>
            </div>
            <div class="file-actions">
                <button class="delete-btn" data-id="${doc.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        // Add delete event listener
        card.querySelector('.delete-btn').addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this document?')) {
                deleteDocument(doc.id);
                card.remove();
            }
        });
        
        return card;
    }
    
    // Helper function to get file icon
    function getFileIcon(fileName) {
        if (fileName.toLowerCase().endsWith('.pdf')) return 'fa-file-pdf';
        if (fileName.toLowerCase().endsWith('.doc') || fileName.toLowerCase().endsWith('.docx')) return 'fa-file-word';
        return 'fa-file';
    }
    
    // Helper function to format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // LocalStorage functions
    function getDocuments() {
        const docs = localStorage.getItem('daycare_documents');
        return docs ? JSON.parse(docs) : [];
    }
    
    function saveDocument(doc) {
        const docs = getDocuments();
        docs.push(doc);
        localStorage.setItem('daycare_documents', JSON.stringify(docs));
    }
    
    function deleteDocument(id) {
        let docs = getDocuments();
        docs = docs.filter(doc => doc.id !== id);
        localStorage.setItem('daycare_documents', JSON.stringify(docs));
    }
});
