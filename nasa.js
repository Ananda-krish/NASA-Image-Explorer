document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '24TFDFAjAiFDT5R4POKQjz3Bc1QaPvYnQ8QiooU1';
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=100`;

    const imageGallery = document.getElementById('image-gallery');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const errorMessage = document.getElementById('error-message');
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeButton = document.querySelector('.close-button');
    const showMoreButton = document.getElementById('showMoreButton');
    let allImages = [];
    let displayedImagesCount = 0;
    const imagesPerPage = 20;

    const fetchImages = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            allImages = Array.isArray(data) ? data : [data];
            displayedImagesCount = 0;
            displayNextBatch();
        } catch (error) {
            console.error('Error fetching images:', error);
            imageGallery.innerHTML = '<p>Failed to load images. Please try again later.</p>';
        }
    };

    const displayImages = (images) => {
        images.forEach(image => {
            const imageItem = document.createElement('div');
            imageItem.classList.add('image-item');
            imageItem.innerHTML = `
                <img src="${image.url}" alt="${image.title}">
                <h3>${image.title}</h3>
            `;
            imageItem.addEventListener('click', () => openModal(image));
            imageGallery.appendChild(imageItem);
        });
    };

    const displayNextBatch = () => {
        const nextBatch = allImages.slice(displayedImagesCount, displayedImagesCount + imagesPerPage);
        displayImages(nextBatch);
        displayedImagesCount += imagesPerPage;
        if (displayedImagesCount >= allImages.length) {
            showMoreButton.style.display = 'none';
        } else {
            showMoreButton.style.display = 'block';
        }
    };

    const openModal = (image) => {
        modalImage.src = image.url;
        modalTitle.textContent = image.title;
        modalDescription.textContent = image.explanation;
        modal.style.display = 'block';
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };

    const filterImagesByTitle = (title) => {
        const filteredImages = allImages.filter(image => image.title.toLowerCase().includes(title.toLowerCase()));
        if (filteredImages.length === 0) {
            errorMessage.style.display = 'block';
            imageGallery.innerHTML = '';
            showMoreButton.style.display = 'none';
        } else {
            errorMessage.style.display = 'none';
            imageGallery.innerHTML = '';
            displayedImagesCount = 0;
            displayImages(filteredImages.slice(0, imagesPerPage));
            displayedImagesCount = imagesPerPage;
            if (displayedImagesCount < filteredImages.length) {
                showMoreButton.style.display = 'block';
            } else {
                showMoreButton.style.display = 'none';
            }
            allImages = filteredImages;
        }
    };

    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            filterImagesByTitle(searchTerm);
        }
    });

    searchInput.addEventListener('input', () => {
        errorMessage.style.display = 'none';
        if (!searchInput.value.trim()) {
            imageGallery.innerHTML = '';
            fetchImages();
        }
    });

    showMoreButton.addEventListener('click', () => {
        displayNextBatch();
    });

    fetchImages();
});

