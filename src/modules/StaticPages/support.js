


export const getStaticSupportPage = (_req, res) => {
  const currentYear = new Date().getFullYear();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Support - Photop</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      color: #333;
      text-align: center;
    }
    header {
      background-color: #DD1122;
      color: #fff;
      padding: 20px 0;
    }
    h1 {
      margin: 0;
      font-size: 2rem;
    }
    .content {
      max-width: 600px;
      margin: 50px auto;
      padding: 25px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .support-list {
      text-align: left;
      margin: 20px auto;
      max-width: 400px;
    }
    .support-list li {
      margin-bottom: 8px;
    }
    .contact-info {
      margin-top: 25px;
      font-size: 1.05rem;
      line-height: 1.8;
    }
    .contact-info strong {
      color: #DD1122;
    }
    footer {
      margin-top: 50px;
      padding: 15px;
      background-color: #f1f1f1;
      font-size: 0.9rem;
      color: #555;
    }
  </style>
</head>
<body>

  <header>
    <h1>Photop Support</h1>
  </header>

  <div class="content">
    <p>
      If you face any issues while using the <strong>Photop</strong> app or have any questions,
      feel free to contact us.
    </p>

    <ul class="support-list">
      <li>App usage issues</li>
      <li>Account-related help</li>
      <li>Booking or payment questions</li>
      <li>Feedback and suggestions</li>
    </ul>

    <div class="contact-info">
      <p><strong>Email:</strong> support@photop.app</p>
      <p><strong>Support Availability:</strong> 24/7, 7 days a week</p>
    </div>

    <p>We aim to respond as quickly as possible and help resolve your concerns.</p>
  </div>

  <footer>
    © ${currentYear} Photop. All rights reserved.
  </footer>

</body>
</html>
  `;

  res.send(html);
};
