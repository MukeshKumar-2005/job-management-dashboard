
const API_URL = "http://127.0.0.1:8000/api/jobs/";

let allJobs = [];
let jobModal;


// Load jobs from Django API
async function loadJobs() {

    const loading = document.getElementById("loading");
    const container = document.getElementById("jobsContainer");
    const emptyState = document.getElementById("emptyState");

    loading.classList.remove("d-none");
    container.innerHTML = "";
    emptyState.classList.add("d-none");

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to fetch jobs");
        }

        const data = await response.json();

        // Django REST Framework pagination
        allJobs = Array.isArray(data) ? data : data.results;

        renderJobs(allJobs);
        updateStatistics(allJobs);
        renderAnalytics(allJobs);

    } catch (error) {

        console.error(error);
        container.innerHTML = `
            <div class="alert alert-danger">
                Unable to load jobs. Please check your Django server and API.
            </div>
        `;

    } finally {
        loading.classList.add("d-none");
    }
}


// Display job cards
function renderJobs(jobs) {

    const container = document.getElementById("jobsContainer");
    const emptyState = document.getElementById("emptyState");

    container.innerHTML = "";

    if (!jobs || jobs.length === 0) {
        emptyState.classList.remove("d-none");
        return;
    }

    emptyState.classList.add("d-none");

    jobs.forEach(job => {

        const image = job.profile_picture
            ? (job.profile_picture.startsWith("http")
                ? job.profile_picture
                : `http://127.0.0.1:8000${job.profile_picture}`)
            : "https://placehold.co/100x100?text=Job";

        const description = job.description || "";

        const card = document.createElement("div");
        card.className = "job-card";

        card.innerHTML = `
            <div class="job-card-header">

                <img src="${image}" class="job-image" alt="Job image">

                <div class="flex-grow-1">
                    <h5>${escapeHTML(job.title)}</h5>

                    <p class="job-location">
                        <i class="bi bi-geo-alt"></i>
                        ${escapeHTML(job.city || "City not specified")},
                        ${escapeHTML(job.state || "")}
                    </p>

                    <span class="status-badge status-${job.status}">
                        ${escapeHTML(job.status)}
                    </span>
                </div>

            </div>

            <p class="job-description">
                ${escapeHTML(description.substring(0, 140))}
                ${description.length > 140 ? "..." : ""}
            </p>

            <div class="job-meta">
                <span>${escapeHTML(formatCategory(job.category))}</span>
                <span>${escapeHTML(job.address || "Address not specified")}</span>
            </div>

            <div class="job-actions">

                <button class="btn btn-sm btn-outline-primary"
                    onclick="editJob(${job.id})">
                    <i class="bi bi-pencil"></i> Edit
                </button>

                <button class="btn btn-sm btn-outline-danger"
                    onclick="deleteJob(${job.id})">
                    <i class="bi bi-trash"></i> Delete
                </button>

                <button class="btn btn-sm btn-outline-success"
                    onclick="duplicateJob(${job.id})">
                    <i class="bi bi-copy"></i> Duplicate
                </button>

            </div>
        `;

        container.appendChild(card);

    });

}


// Basic HTML escaping for API text
function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

}


// Convert category names
function formatCategory(category) {

    const categories = {
        full_time: "Full-time",
        part_time: "Part-time",
        intern: "Intern"
    };

    return categories[category] || category || "Not specified";
}


// Update dashboard statistics
function updateStatistics(jobs) {

    document.getElementById("totalJobs").textContent = jobs.length;

    document.getElementById("postedJobs").textContent =
        jobs.filter(job => job.status === "posted").length;

    document.getElementById("requestedJobs").textContent =
        jobs.filter(job => job.status === "requested").length;

    document.getElementById("draftJobs").textContent =
        jobs.filter(job => job.status === "draft").length;

}


// Create modal
function openCreateModal() {

    document.getElementById("jobForm").reset();
    document.getElementById("jobId").value = "";
    document.getElementById("modalTitle").textContent = "Create New Job";
    document.getElementById("imagePreview").classList.add("d-none");

    jobModal.show();

}


// Save new job or update existing job
document.getElementById("jobForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const jobId = document.getElementById("jobId").value;

    const startDate = document.getElementById("start_date").value;
    const endDate = document.getElementById("end_date").value;

    if (startDate && endDate && endDate < startDate) {
        alert("End date cannot be before start date.");
        return;
    }

    const formData = new FormData();

    const fields = [
        "title",
        "status",
        "category",
        "address",
        "city",
        "state",
        "start_date",
        "end_date",
        "description"
    ];

    fields.forEach(field => {
        formData.append(field, document.getElementById(field).value);
    });

    const image = document.getElementById("profile_picture").files[0];

    if (image) {
        formData.append("profile_picture", image);
    }

    const url = jobId ? `${API_URL}${jobId}/` : API_URL;
    const method = jobId ? "PATCH" : "POST";

    const saveButton = document.getElementById("saveButton");
    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    try {

        const response = await fetch(url, {
            method: method,
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(JSON.stringify(result));
        }

        alert(jobId ? "Job updated successfully!" : "Job created successfully!");

        jobModal.hide();
        await loadJobs();

    } catch (error) {

        console.error(error);
        alert("Unable to save job: " + error.message);

    } finally {

        saveButton.disabled = false;
        saveButton.textContent = "Save Job";

    }

});


// Edit job
function editJob(id) {

    const job = allJobs.find(item => item.id === id);

    if (!job) return;

    document.getElementById("jobId").value = job.id;

    const fields = [
        "title",
        "status",
        "category",
        "address",
        "city",
        "state",
        "start_date",
        "end_date",
        "description"
    ];

    fields.forEach(field => {
        document.getElementById(field).value = job[field] || "";
    });

    document.getElementById("modalTitle").textContent = "Edit Job";

    const preview = document.getElementById("imagePreview");

    if (job.profile_picture) {
        preview.src = job.profile_picture.startsWith("http")
            ? job.profile_picture
            : `http://127.0.0.1:8000${job.profile_picture}`;

        preview.classList.remove("d-none");
    } else {
        preview.classList.add("d-none");
    }

    jobModal.show();

}


// Delete job
async function deleteJob(id) {

    const confirmed = confirm("Are you sure you want to delete this job?");

    if (!confirmed) return;

    try {

        const response = await fetch(`${API_URL}${id}/`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        alert("Job deleted successfully!");

        await loadJobs();

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

}


// Duplicate job
async function duplicateJob(id) {

    try {

        const response = await fetch(`${API_URL}${id}/duplicate/`, {
            method: "POST"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(JSON.stringify(result));
        }

        alert("Job duplicated successfully!");

        await loadJobs();

        // Show the duplicated job immediately below original
        const newJob = result.job || result;
        const originalIndex = allJobs.findIndex(job => job.id === id);

        if (originalIndex !== -1) {
            allJobs = allJobs.filter(job => job.id !== newJob.id);
            allJobs.splice(originalIndex + 1, 0, newJob);
            renderJobs(allJobs);
        }

    } catch (error) {

        console.error(error);
        alert("Unable to duplicate job: " + error.message);

    }

}


// Search and filters
function applyFilters() {

    const search = document.getElementById("searchInput").value.toLowerCase();
    const status = document.getElementById("statusFilter").value;
    const city = document.getElementById("cityFilter").value.toLowerCase();

    const filtered = allJobs.filter(job => {

        const matchesSearch = (job.title || "").toLowerCase().includes(search);

        const matchesStatus = !status || job.status === status;

        const matchesCity = (job.city || "").toLowerCase().includes(city);

        return matchesSearch && matchesStatus && matchesCity;

    });

    renderJobs(filtered);

}


document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("statusFilter").addEventListener("change", applyFilters);
document.getElementById("cityFilter").addEventListener("input", applyFilters);


// Reset filters
function resetFilters() {

    document.getElementById("searchInput").value = "";
    document.getElementById("statusFilter").value = "";
    document.getElementById("cityFilter").value = "";

    renderJobs(allJobs);

}


// Image preview
document.getElementById("profile_picture").addEventListener("change", function(event) {

    const file = event.target.files[0];
    const preview = document.getElementById("imagePreview");

    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.classList.remove("d-none");
    } else {
        preview.classList.add("d-none");
    }

});


// Analytics
function renderAnalytics(jobs) {

    const statusContainer = document.getElementById("statusAnalytics");
    const cityContainer = document.getElementById("cityAnalytics");

    statusContainer.innerHTML = "";
    cityContainer.innerHTML = "";

    const statuses = ["posted", "draft", "requested", "filled"];

    statuses.forEach(status => {

        const count = jobs.filter(job => job.status === status).length;
        const percentage = jobs.length ? (count / jobs.length) * 100 : 0;

        statusContainer.innerHTML += `
            <div class="analytics-row">
                <div class="analytics-label">
                    <span>${escapeHTML(status)}</span>
                    <strong>${count}</strong>
                </div>

                <div class="analytics-track">
                    <div class="analytics-fill" style="width:${percentage}%"></div>
                </div>
            </div>
        `;

    });


    const cityCounts = {};

    jobs.forEach(job => {

        const city = job.city || "Not specified";

        cityCounts[city] = (cityCounts[city] || 0) + 1;

    });

    Object.entries(cityCounts).forEach(([city, count]) => {

        const percentage = jobs.length ? (count / jobs.length) * 100 : 0;

        cityContainer.innerHTML += `
            <div class="analytics-row">
                <div class="analytics-label">
                    <span>${escapeHTML(city)}</span>
                    <strong>${count}</strong>
                </div>

                <div class="analytics-track">
                    <div class="analytics-fill" style="width:${percentage}%"></div>
                </div>
            </div>
        `;

    });

}


// Initialize dashboard
document.addEventListener("DOMContentLoaded", function() {

    jobModal = new bootstrap.Modal(document.getElementById("jobModal"));

    loadJobs();

});
