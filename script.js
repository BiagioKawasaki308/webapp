let currentPage = 1;
const limit = 20;
let currentImageIndex = 0;
let images = [];

document.getElementById('searchButton').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchTerm').value;
    if (searchTerm) {
        currentPage = 1; // Reset to first page on new search
        fetchImages(searchTerm, currentPage);
    }
});

document.getElementById('searchTerm').addEventListener('input', function() {
    const searchTerm = document.getElementById('searchTerm').value;
    if (searchTerm.length > 2) {
        fetchTags(searchTerm);
    } else {
        clearSuggestions();
    }
});

window.addEventListener('scroll', function() {
    const scrollTopButton = document.getElementById('scrollTop');
    if (window.pageYOffset > 300) {
        scrollTopButton.style.display = 'block';
    } else {
        scrollTopButton.style.display = 'none';
    }
});

document.getElementById('scrollTop').addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

async function fetchTags(query) {
    const apiUrl = `/api/tags?query=${query}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displaySuggestions(data);
    } catch (error) {
        console.error('Error fetching tags:', error);
    }
}

function displaySuggestions(tags) {
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = '';
    tags.slice(0, 10).forEach(tag => {
        const li = document.createElement('li');
        li.textContent = tag.name;
        li.addEventListener('click', function() {
            document.getElementById('searchTerm').value = tag.name;
            clearSuggestions();
        });
        suggestionsDiv.appendChild(li);
    });
}

function clearSuggestions() {
    document.getElementById('suggestions').innerHTML = '';
}

async function fetchImages(tag, page) {
    const contentFilter = document.getElementById('contentFilter').value;
    const apiUrl = `/api/images?tag=${tag}&limit=${limit}&page=${page}&rating=${contentFilter}`;
    try {
        const response = await fetch(apiUrl);
        images = await response.json();
        displayResults(images);
        updatePaginationControls(tag);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch images. Please try again later.');
    }
}

function displayResults(images) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results
    images.forEach((image, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = image.file_url;
        imgElement.loading = "lazy"; // Lazy loading
        imgElement.addEventListener('click', () => openLightbox(index));
        resultsDiv.appendChild(imgElement);
    });
}

function updatePaginationControls(tag) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = ''; // Clear previous pagination controls
    
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => {
            currentPage--;
            fetchImages(tag, currentPage);
        });
        paginationDiv.appendChild(prevButton);
    }
    
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
        currentPage++;
        fetchImages(tag, currentPage);
    });
    paginationDiv.appendChild(nextButton);
}

// Lightbox functionality
function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const imageDescription = document.getElementById('imageDescription');
    
    lightboxImage.style.opacity = 0;
    setTimeout(() => {
        lightboxImage.src = images[index].file_url;
        imageDescription.innerText = images[index].tag_string || "No description available.";
        lightboxImage.style.opacity = 1;
    }, 200);
    
    lightbox.style.display = 'block';
}

document.querySelector('.close').addEventListener('click', closeLightbox);
document.querySelector('.prev').addEventListener('click', showPrevImage);
document.querySelector('.next').addEventListener('click', showNextImage);

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    openLightbox(currentImageIndex);
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    openLightbox(currentImageIndex);
}

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('change', function() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
});

// Load theme preference
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.checked = true;
    }
});
