

export const getStaticPrivacyPolicyPage = (_req, res) => {
    const currentYear = new Date().getFullYear();
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Privacy Policy - Photop</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 40px;
      background-color: #ffffff;
      color: #333;
      line-height: 1.6;
    }
    h1, h2 {
      color: #DD1122;
    }
    h1 {
      text-align: center;
      margin-bottom: 10px;
    }
    p.intro {
      text-align: center;
      font-style: italic;
      margin-bottom: 40px;
    }
    section {
      margin-bottom: 25px;
    }
    ul {
      padding-left: 20px;
    }
    footer {
      margin-top: 60px;
      font-size: 0.9rem;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>

  <h1>Photop Privacy Policy</h1>
  <p class="intro">Your privacy matters to us</p>

  <section>
    <p><strong>Photop</strong> values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.</p>
  </section>

  <section>
    <h2>Information We Collect</h2>
    <ul>
      <li>Name, email, and contact details</li>
      <li>App usage data (such as bookings and activity logs)</li>
      <li>Basic device information</li>
    </ul>
  </section>

  <section>
    <h2>How We Use Your Information</h2>
    <ul>
      <li>To provide and improve our services</li>
      <li>To enhance user experience</li>
      <li>To ensure security and customer support</li>
    </ul>
  </section>

  <section>
    <h2>Data Protection</h2>
    <p>
      We use appropriate security measures to protect your data. 
      We do not sell or share your personal information with third parties.
    </p>
  </section>

  <section>
    <p>By using the Photop app, you agree to this Privacy Policy.</p>
    <p>
      📧 Contact: <a href="mailto:privacy@photop.app">privacy@photop.app</a>
    </p>
  </section>

  <footer>
    &copy; ${currentYear} Photop. All rights reserved.
  </footer>

</body>
</html>
  `;

  res.send(html);
};
