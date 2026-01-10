

export const getStaticAccountDeletePolicy = (_req, res) => {
  const currentYear = new Date().getFullYear();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Delete Account - Photop</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 40px;
      padding: 0;
      background-color: #ffffff;
      color: #333;
      line-height: 1.6;
    }
    h1, .intro {
      text-align: center;
    }
    h1 {
      color: #DD1122;
      margin-bottom: 10px;
    }
    h2 {
      color: #DD1122;
      margin-top: 32px;
    }
    .step {
      margin-bottom: 26px;
      text-align: left;
      max-width: 820px;
      margin-left: auto;
      margin-right: auto;
    }
    .illustration {
      display: block;
      margin: 10px auto;
      max-width: 320px;
      max-height: 200px;
      width: 100%;
      height: auto;
      object-fit: contain;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 4px;
      background: #fff;
    }
    footer {
      margin-top: 48px;
      font-size: 0.9rem;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>

  <h1>Steps to Delete Your Account</h1>
  <p class="intro">
    Follow these steps to permanently delete your account from the
    <strong>Photop</strong> app.
  </p>

  <div class="step">
    <h2>Step 1: Open Settings</h2>
    <p>Go to your profile and tap <strong>Settings</strong>.</p>
    <img src="https://res.cloudinary.com/dns84qf2p/image/upload/settting_kpovfr.png" alt="Open Settings" class="illustration">
  </div>

  <div class="step">
    <h2>Step 2: Choose “Delete Account”</h2>
    <p>Scroll to the bottom and tap <strong>Delete Account</strong>.</p>
    <img src="https://res.cloudinary.com/dns84qf2p/image/upload/delete_sbcwn7.png" alt="Choose Delete Account" class="illustration">
  </div>

  <div class="step">
    <h2>Step 3: Confirm Your Identity and account Deletion</h2>
    <p>
      When prompted, enter your account password or complete the required
      verification to confirm your identity.
    </p>
    <img src="https://res.cloudinary.com/dns84qf2p/image/upload/inputDelete_tutwii.png" alt="Confirm Identity" class="illustration">
  </div>




  <footer>
    © ${currentYear} Photop. All rights reserved.
  </footer>

</body>
</html>
  `;

  res.send(html);
};
