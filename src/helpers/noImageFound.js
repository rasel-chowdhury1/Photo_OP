function generateNotFoundPage() {
  // Start of the gallery HTML
  let notFoundPage = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>No Image Found</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
        color: #333;
      }
      .container {
        text-align: center;
      }
      .icon {
        font-size: 80px;
        color: #ff6b6b;
      }
      h1 {
        font-size: 24px;
        margin-top: 20px;
        color: #ff6b6b;
      }
      p {
        font-size: 16px;
        margin-top: 10px;
        color: #666;
      }
      a {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #ff6b6b;
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
      }
      a:hover {
        background-color: #ff4c4c;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="icon">&#128247;</div> <!-- Camera emoji or use a relevant icon -->
      <h1>No Image Found</h1>
      <p>Sorry, we couldn't find any images to display.</p>
    </div>
  </body>
  </html>
`
return notFoundPage;
}

module.exports = generateNotFoundPage;
