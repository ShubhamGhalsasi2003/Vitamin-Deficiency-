document.addEventListener("DOMContentLoaded", function() {
    // DOM Elements
    const uploadArea = document.getElementById('uploadArea');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const detectBtn = document.getElementById('detectBtn');
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('resultsContent');
    const profilePhoto = document.getElementById('profilePhoto');
    const uploadProfileBtn = document.getElementById('uploadProfileBtn');
    const profileUpload = document.getElementById('profileUpload');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userPhone = document.getElementById('userPhone');
    const userAge = document.getElementById('userAge');
    const reportsList = document.getElementById('reportsList');

    // Base API URL
    const API_BASE_URL = 'https://your-api-endpoint.com/api';

    // Current user data
    let currentUser = null;

    // Initialize the application
    init();

    function init() {
        // Check if user is logged in and get their data
        fetchUserData()
            .then(user => {
                currentUser = user;
                console.log("User data loaded:", user);
                displayUserProfile(user);
                loadReportHistory(user.id);
            })
            ;

        // Set up event listeners
        setupEventListeners();
    }

    function setupEventListeners() {
        // Image upload events
        uploadArea.addEventListener('click', () => imageUpload.click());
        
        imageUpload.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                displayImagePreview(file);
                detectBtn.disabled = false;
            }
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#4CAF50';
            uploadArea.style.backgroundColor = 'rgba(240,255,240,0.9)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#ccc';
            uploadArea.style.backgroundColor = 'rgba(255,255,255,0.8)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#ccc';
            uploadArea.style.backgroundColor = 'rgba(255,255,255,0.8)';
            
            if (e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                imageUpload.files = e.dataTransfer.files;
                displayImagePreview(file);
                detectBtn.disabled = false;
            }
        });

        detectBtn.addEventListener('click', analyzeImage);

        // Profile photo upload
        if (uploadProfileBtn && profileUpload) {
            uploadProfileBtn.addEventListener('click', () => profileUpload.click());
            profileUpload.addEventListener('change', handleProfilePhotoUpload);
        }
    }

    // Fetch user data from database
    async function fetchUserData() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/current`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    }

    // Display user profile information
    function displayUserProfile(user) {
        if (!user) return;

        userName.textContent = user.name || 'Not specified';
        userEmail.textContent = user.email || 'Not specified';
        userPhone.textContent = user.phone || 'Not specified';
        userAge.textContent = user.age || 'N/A';

        if (user.profilePhoto) {
            profilePhoto.src = user.profilePhoto;
        }
    }

    // Load user's report history
    async function loadReportHistory(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}/reports`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch reports');
            }

            const reports = await response.json();
            displayReportHistory(reports);
        } catch (error) {
            console.error("Error loading report history:", error);
            reportsList.innerHTML = '<div class="no-reports">Error loading reports</div>';
        }
    }

    // Display report history
    function displayReportHistory(reports) {
        if (!reports || reports.length === 0) {
            reportsList.innerHTML = '<div class="no-reports">No reports generated yet</div>';
            return;
        }

        reportsList.innerHTML = '';
        reports.forEach(report => {
            const reportElement = document.createElement('div');
            reportElement.className = 'report-card';
            reportElement.innerHTML = `
                <div class="report-header">
                    <div class="report-title">${report.deficiency.name} Deficiency Report</div>
                    <div class="report-date">${new Date(report.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="report-details">
                    <span class="severity-indicator severity-${report.deficiency.severity.toLowerCase()}">
                        ${report.deficiency.severity}
                    </span>
                    <span class="confidence-level">${report.deficiency.confidence}% confidence</span>
                </div>
                <div class="report-actions">
                    <button class="download-btn" data-report-id="${report.id}">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="view-btn" data-report-id="${report.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            `;

            // Add event listeners
            reportElement.querySelector('.download-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                downloadReportFromHistory(e.target.dataset.reportId);
            });

            reportElement.querySelector('.view-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                viewReport(e.target.dataset.reportId);
            });

            reportElement.addEventListener('click', () => {
                viewReport(report.id);
            });

            reportsList.appendChild(reportElement);
        });
    }

    // Handle profile photo upload
    async function handleProfilePhotoUpload() {
        const file = this.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }

        try {
            // Display preview
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePhoto.src = e.target.result;
            };
            reader.readAsDataURL(file);

            // Upload to server
            const formData = new FormData();
            formData.append('profilePhoto', file);

            const response = await fetch(`${API_BASE_URL}/users/profile-photo`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to upload profile photo');
            }

            alert('Profile photo updated successfully');
        } catch (error) {
            console.error("Error uploading profile photo:", error);
            alert('Failed to update profile photo');
        }
    }

    function displayImagePreview(file) {
        if (file.type.match('image.*')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                resultsSection.hidden = true;
            };
            
            reader.readAsDataURL(file);
        } else {
            alert('Please upload an image file.');
        }
    }

    async function analyzeImage() {
        if (!currentUser) {
            alert('Please login first');
            window.location.href = 'login.html';
            return;
        }

        if (!imageUpload.files || imageUpload.files.length === 0) {
            alert('Please select an image first');
            return;
        }

        // Show loading state
        detectBtn.disabled = true;
        detectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        
        try {
            // 1. Upload image for processing
            const formData = new FormData();
            formData.append('image', imageUpload.files[0]);
            formData.append('userId', currentUser.id);

            const response = await fetch(`${API_BASE_URL}/analyze`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Image analysis failed');
            }

            const analysisResult = await response.json();
            
            // 2. Generate and display report
            const report = await generateReport(analysisResult);
            displayResults(report);
            
            // 3. Save report to database and refresh history
            await saveReportToDatabase(report);
            loadReportHistory(currentUser.id);

        } catch (error) {
            console.error("Analysis error:", error);
            alert("Failed to analyze image. Please try again.");
        } finally {
            detectBtn.disabled = false;
            detectBtn.textContent = 'Detect Deficiency';
        }
    }

    async function generateReport(analysisResult) {
        // Get current date and time
        const now = new Date();
        const reportDate = now.toLocaleDateString();
        const reportTime = now.toLocaleTimeString();

        // Get deficiency details from our database
        const deficiencyDetails = await fetchDeficiencyDetails(analysisResult.deficiencyType);
        
        return {
            reportId: 'RPT-' + Math.floor(10000 + Math.random() * 90000),
            reportDate,
            reportTime,
            patientId: currentUser.id,
            patientName: currentUser.name,
            patientAge: currentUser.age,
            deficiency: {
                type: analysisResult.deficiencyType,
                name: deficiencyDetails.name,
                severity: analysisResult.severity,
                confidence: analysisResult.confidence,
                symptoms: deficiencyDetails.symptoms,
                causes: deficiencyDetails.causes,
                recommendations: deficiencyDetails.recommendations
            },
            image: imagePreview.src,
            analysisData: analysisResult,
            createdAt: new Date().toISOString()
        };
    }

    async function fetchDeficiencyDetails(deficiencyType) {
        try {
            const response = await fetch(`${API_BASE_URL}/deficiency/${deficiencyType}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch deficiency details');
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching deficiency details:", error);
            return getDefaultDeficiencyData(deficiencyType);
        }
    }

    function getDefaultDeficiencyData(type) {
        const defaultData = {
            A: {
                name: "Vitamin A",
                symptoms: ["Night blindness", "Dry eyes", "Dry skin", "Frequent infections"],
                causes: ["Inadequate dietary intake", "Malabsorption disorders", "Zinc deficiency"],
                recommendations: ["Increase vitamin A-rich foods", "Consider supplements", "Treat underlying conditions"]
            },
            B: {
                name: "Vitamin B Complex",
                symptoms: ["Fatigue", "Pale skin", "Tingling in hands/feet"],
                causes: ["Poor diet", "Pernicious anemia", "Alcoholism"],
                recommendations: ["Eat B-vitamin rich foods", "Consider B-complex supplements"]
            },
            C: {
                name: "Vitamin C",
                symptoms: ["Easy bruising", "Slow wound healing", "Bleeding gums"],
                causes: ["Lack of fruits/vegetables", "Smoking", "Malabsorption"],
                recommendations: ["Eat citrus fruits", "Take vitamin C supplements"]
            },
            D: {
                name: "Vitamin D",
                symptoms: ["Bone pain", "Muscle weakness", "Fatigue"],
                causes: ["Limited sun exposure", "Darker skin", "Obesity"],
                recommendations: ["Get sunlight", "Take vitamin D3 supplements"]
            },
            E: {
                name: "Vitamin E",
                symptoms: ["Muscle weakness", "Vision problems", "Dry skin"],
                causes: ["Fat malabsorption", "Low-fat diets", "Genetic disorders"],
                recommendations: ["Eat nuts and seeds", "Consider vitamin E supplements"]
            }
        };

        return defaultData[type] || defaultData.A;
    }

    async function saveReportToDatabase(report) {
        try {
            const response = await fetch(`${API_BASE_URL}/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(report)
            });

            if (!response.ok) {
                throw new Error('Failed to save report');
            }

            return await response.json();
        } catch (error) {
            console.error("Error saving report:", error);
            throw error;
        }
    }

    function displayResults(report) {
        resultsSection.hidden = false;
        
        const severityClass = `severity-${report.deficiency.severity.toLowerCase()}`;
        
        const html = `
            <div class="report-header slide-up">
                <h2>Vitamin Deficiency Analysis Report</h2>
                <div class="patient-info">
                    <div>
                        <p><strong>Patient ID:</strong> ${report.patientId}</p>
                        <p><strong>Name:</strong> ${report.patientName}</p>
                    </div>
                    <div>
                        <p><strong>Age:</strong> ${report.patientAge}</p>
                    </div>
                </div>
                <div class="report-meta">
                    <p><strong>Report ID:</strong> ${report.reportId}</p>
                    <p><strong>Date:</strong> ${report.reportDate}</p>
                    <p><strong>Time:</strong> ${report.reportTime}</p>
                </div>
            </div>
            
            <div class="image-preview-container">
                <h3>Analyzed Image</h3>
                <img src="${report.image}" class="analyzed-image">
            </div>
            
            <div class="deficiency-section slide-up">
                <h3>
                    ${report.deficiency.name} Deficiency 
                    <span class="severity-indicator ${severityClass}">${report.deficiency.severity}</span>
                </h3>
                
                <div class="confidence-level">
                    <p><strong>Detection Confidence:</strong> ${report.deficiency.confidence}%</p>
                    <div class="confidence-bar-container">
                        <div class="confidence-bar" style="width: ${report.deficiency.confidence}%"></div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Symptoms:</h4>
                    <ul>
                        ${report.deficiency.symptoms.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4>Possible Causes:</h4>
                    <ul>
                        ${report.deficiency.causes.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="detail-section recommendations">
                    <h4>Recommendations:</h4>
                    <ol>
                        ${report.deficiency.recommendations.map(r => `<li>${r}</li>`).join('')}
                    </ol>
                </div>
            </div>
            
            <div class="report-actions slide-up">
                <button class="report-btn" id="downloadPdf">
                    <i class="fas fa-file-pdf"></i> Download PDF
                </button>
                <button class="report-btn" id="downloadJpg">
                    <i class="fas fa-file-image"></i> Download JPG
                </button>
            </div>
        `;
        
        resultsContent.innerHTML = html;
        
        document.getElementById('downloadPdf').addEventListener('click', () => downloadReport('pdf', report));
        document.getElementById('downloadJpg').addEventListener('click', () => downloadReport('jpg', report));
    }

    async function downloadReportFromHistory(reportId) {
        try {
            const response = await fetch(`${API_BASE_URL}/reports/${reportId}/download`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to download report');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `vitamin_report_${reportId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();

        } catch (error) {
            console.error("Error downloading report:", error);
            alert('Failed to download report');
        }
    }

    async function viewReport(reportId) {
        try {
            const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch report');
            }

            const report = await response.json();
            displayResults(report);
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error("Error viewing report:", error);
            alert('Failed to load report');
        }
    }

    function downloadReport(format, report) {
        // In a real app, this would generate the file for download
        console.log(`Downloading ${format} report:`, report);
        alert(`Report download would be initiated as ${format.toUpperCase()}`);
    }
});