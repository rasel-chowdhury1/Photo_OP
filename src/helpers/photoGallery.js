function generateGalleryHtml(imageLinks, host = 'web') {
  // Start of the gallery HTML
  let galleryHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Responsive Photo Gallery</title>
      <style>
          body {
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background-color: #f0f0f0;
          }
          .gallery {
              column-count: 3;
              column-gap: 10px;
              padding: 20px;
              width: 90vw;
              max-width: 1200px;
              flex: 1;
          }
          .gallery-item {
              position: relative;
              margin-bottom: 10px;
              break-inside: avoid;
              border: 2px solid white;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              cursor: pointer;
              transition: transform 0.2s ease;
          }
          .gallery-item img {
              width: 100%;
              height: auto;
              display: block;
          }
          .gallery-item:hover {
              transform: scale(1.05);
          }
          .download-icon {
              position: absolute;
              bottom: 10px;
              right: 10px;
              background-color: rgba(255, 255, 255, 0.8); /* Add a visible background */
              border-radius: 50%;
              padding: 10px;
              cursor: pointer;
              display: flex;
              justify-content: center;
              align-items: center;
          }
          .download-icon svg {
              width: 24px;
              height: 24px;
              fill: #000;
          }
          /* Modal Styles */
          .modal {
              display: none;
              position: fixed;
              z-index: 1000;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              overflow: auto;
              background-color: rgba(0, 0, 0, 0.8);
              justify-content: center;
              align-items: center;
              padding: 20px;
              box-sizing: border-box;
          }
          .modal-content {
              margin: auto;
              display: block;
              max-width: 100%;
              max-height: 100%;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              animation-name: zoom;
              animation-duration: 0.6s;
          }
          @keyframes zoom {
              from {transform: scale(0)} 
              to {transform: scale(1)}
          }
          .modal-close {
              position: absolute;
              top: 20px;
              right: 30px;
              color: white;
              font-size: 40px;
              font-weight: bold;
              cursor: pointer;
          }
          /* Footer Styles */
          footer {
              background-color: #333;
              color: white;
              padding: 20px;
              text-align: center;
              width: 100%;
          }
          footer .store-links {
              margin-top: 10px;
          }
          footer .store-links a {
              display: inline-block;
              margin: 0 10px;
          }
          footer .store-links img {
              height: 40px;
          }
          /* Responsive Adjustments */
          @media (max-width: 1024px) {
              .gallery {
                  column-count: 3;
              }
          }
          @media (max-width: 768px) {
              .gallery {
                  column-count: 2;
              }
              .modal-content {
                  max-width: 90%;
                  max-height: 90%;
              }
          }
          @media (max-width: 480px) {
              .gallery {
                  column-count: 1;
              }
              .modal-content {
                  max-width: 100%;
                  max-height: 100%;
              }
              .modal-close {
                  font-size: 30px;
              }
          }
      </style>
  </head>
  <body>
      <div class="gallery">
  `;

  // Loop through the image URLs to add each image to the gallery
  imageLinks.forEach(link => {
    galleryHtml += `
      <div class="gallery-item" onclick="openModal('${link}')">
          <img src="${link}" alt="Gallery Image"/>
          <div class="download-icon" onclick="downloadImage(event, '${link}')">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>
          </div>
      </div>`;
  });

  // Close the gallery container and add the modal
  galleryHtml += `
      </div>
      
      <!-- The Modal -->
      <div id="myModal" class="modal">
          <span class="modal-close" onclick="closeModal()">&times;</span>
          <img class="modal-content" id="modalImg">
      </div>

      <script>
          // Function to open the modal
          function openModal(imageSrc) {
              var modal = document.getElementById('myModal');
              var modalImg = document.getElementById('modalImg');
              modal.style.display = "flex";
              modalImg.src = imageSrc;
          }

          // Function to close the modal
          function closeModal() {
              var modal = document.getElementById('myModal');
              modal.style.display = "none";
          }

          // Close the modal when clicking outside the image
          window.onclick = function(event) {
              var modal = document.getElementById('myModal');
              if (event.target == modal) {
                  modal.style.display = "none";
              }
          }

          // Function to download the image
          async function downloadImage(event, imageSrc) {
              event.stopPropagation(); // Prevent triggering the modal

              // Fetch the image
              const response = await fetch(imageSrc);
              const blob = await response.blob();

              // Create a link element, use it to download the image, and then remove it
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = imageSrc.split('/').pop(); // Use the image name as the download file name
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          }
      </script>

  `
  if (host === 'web') {
    galleryHtml += `
      <footer>
          <p>Download our app for more exclusive features!</p>
          <div class="store-links">
              <a href="https://play.google.com/store/apps/details?id=com.example.app">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play">
              </a>
              <a href="https://apps.apple.com/app/id1234567890">
                  <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-example-preferred_2x.png" alt="Download on the App Store">
              </a>
          </div>
      </footer>
    `;
  }

  galleryHtml += `
  </body>
  </html>`;

  return galleryHtml;
}

module.exports = generateGalleryHtml;
