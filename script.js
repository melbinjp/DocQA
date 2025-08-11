// Global state
        let uploadedDocs = {};
        let API_ROOT = "https://melbinjp-DocQA.hf.space/";

        // Tab switching
        function switchTab(tabName) {
            // Update tab buttons
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');

            // Update tab content
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabName}-tab`).classList.add('active');

            if (tabName === 'documents') {
                updateDocumentsList();
            }
        }

        // Drag and drop
        const dropZone = document.getElementById('dropZone');

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files[0]);
            }
        });

        // File input change
        document.getElementById('fileInput').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
            }
        });

        // File upload handler
        async function handleFileUpload(file) {
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                showStatus('error', 'File too large. Maximum size is 5MB.');
                return;
            }
            const formData = new FormData();
            formData.append('file', file);
            showStatus('info', 'Uploading and processing document...');
            try {
                const response = await fetch(`${API_ROOT}ingest`, {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (response.ok) {
                    uploadedDocs[data.doc_id] = {
                        name: file.name,
                        chunks: data.chunks,
                        uploadTime: new Date().toLocaleString()
                    };
                    showStatus('success', `✅ Document uploaded successfully! Document ID: ${data.doc_id} (${data.chunks} chunks)`);
                    setTimeout(() => {
                        document.querySelectorAll('.tab')[1].click();
                    }, 2000);
                } else {
                    showStatus('error', `Error: ${data.detail || 'Upload failed'}`);
                }
            } catch (error) {
                showStatus('error', `Error: ${error.message}`);
            }
        }

        // URL upload handler
        async function uploadURL() {
            const url = document.getElementById('urlInput').value.trim();
            if (!url) {
                showStatus('error', 'Please enter a URL');
                return;
            }
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                showStatus('error', 'Please enter a valid URL starting with http:// or https://');
                return;
            }
            showStatus('info', 'Fetching and processing URL...');
            try {
                const response = await fetch(`${API_ROOT}ingest`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url: url })
                });
                const data = await response.json();
                if (response.ok) {
                    uploadedDocs[data.doc_id] = {
                        name: url,
                        chunks: data.chunks,
                        uploadTime: new Date().toLocaleString()
                    };
                    showStatus('success', `✅ URL content uploaded successfully! Document ID: ${data.doc_id} (${data.chunks} chunks)`);
                    document.getElementById('urlInput').value = '';
                    setTimeout(() => {
                        document.querySelectorAll('.tab')[1].click();
                    }, 2000);
                } else {
                    showStatus('error', `Error: ${data.detail || 'URL fetch failed'}`);
                }
            } catch (error) {
                showStatus('error', `Error: ${error.message}`);
            }
        }

        // Query submission
        async function submitQuery() {
            const query = document.getElementById('queryInput').value.trim();
            if (!query) {
                showStatus('error', 'Please enter a question');
                return;
            }
            if (Object.keys(uploadedDocs).length === 0) {
                showStatus('error', 'Please upload at least one document first');
                return;
            }
            const submitBtn = document.getElementById('submitBtn');
            const loader = document.getElementById('queryLoader');
            const results = document.getElementById('results');
            submitBtn.disabled = true;
            loader.classList.add('show');
            results.classList.remove('show');
            try {
                const response = await fetch(`${API_ROOT}query?q=${encodeURIComponent(query)}`, {
                    method: 'GET'
                });
                const data = await response.json();
                if (response.ok) {
                    displayResults(data);
                } else {
                    showStatus('error', `Error: ${data.detail || 'Query failed'}`);
                }
            } catch (error) {
                showStatus('error', `Error: ${error.message}`);
            } finally {
                submitBtn.disabled = false;
                loader.classList.remove('show');
            }
        }

        // Display query results
        function displayResults(data) {
            const results = document.getElementById('results');
            const answerDiv = document.getElementById('answer');
            const sourcesDiv = document.getElementById('sources');

            // Display answer
            answerDiv.innerHTML = `
                <div style="white-space: pre-wrap; line-height: 1.6;">
                    ${escapeHtml(data.answer)}
                </div>
                ${data.confidence ? `
                    <div style="margin-top: 10px; font-size: 14px; color: #666;">
                        Confidence: ${(data.confidence * 100).toFixed(1)}%
                    </div>
                ` : ''}
            `;

            // Display sources
            if (data.sources && data.sources.length > 0) {
                sourcesDiv.innerHTML = data.sources.map((source, idx) => `
                    <div class="source-item">
                        <strong>Source ${idx + 1}:</strong><br>
                        ${escapeHtml(source.substring(0, 200))}${source.length > 200 ? '...' : ''}
                    </div>
                `).join('');
            } else {
                sourcesDiv.innerHTML = '<p style="color: #666;">No sources found</p>';
            }

            results.classList.add('show');
        }

        // Update documents list
        function updateDocumentsList() {
            const listDiv = document.getElementById('documentsList');

            if (Object.keys(uploadedDocs).length === 0) {
                listDiv.innerHTML = `
                    <p style="color: #666; text-align: center; padding: 40px;">
                        No documents uploaded yet. Go to the Upload tab to add documents.
                    </p>
                `;
                return;
            }

            listDiv.innerHTML = Object.entries(uploadedDocs).map(([docId, doc]) => `
                <div class="doc-item">
                    <div>
                        <div class="doc-name">${escapeHtml(doc.name)}</div>
                        <div class="doc-info">
                            ID: ${docId} | ${doc.chunks} chunks | Uploaded: ${doc.uploadTime}
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Set example query
        function setQuery(text) {
            document.getElementById('queryInput').value = text;
            document.getElementById('queryInput').focus();
        }

        // Show status message
        function showStatus(type, message) {
            const toastContainer = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;

            toastContainer.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('show');
            }, 100);

            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.remove();
                }, 500);
            }, 5000);
        }

        // Escape HTML
        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, m => map[m]);
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + U for upload
            if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                e.preventDefault();
                document.querySelectorAll('.tab')[0].click();
            }
            // Ctrl/Cmd + Q for query
            if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
                e.preventDefault();
                document.querySelectorAll('.tab')[1].click();
                document.getElementById('queryInput').focus();
            }
        });

        // Check API health on load
        window.addEventListener('load', async () => {
            try {
                const response = await fetch(`${API_ROOT}health`);
                const data = await response.json();
                console.log('API Health:', data);
            } catch (error) {
                console.error('API Health check failed:', error);
            }
        });
