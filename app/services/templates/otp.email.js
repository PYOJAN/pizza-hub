const getOtpEmailTemplate = (OTP, validFor) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>OTP Email Template</title>
      <style>
        /* Import Tailwind CSS */
        @import url('https://unpkg.com/tailwindcss@2.2.15/dist/tailwind.min.css');
      </style>
    </head>
    <body>
      <!-- Main container -->
      <div class="container mx-auto p-4">
        <!-- Header -->
        <header class="bg-blue-500 text-white p-4">
          <h1 class="text-2xl font-bold">One-Time Password</h1>
        </header>
  
        <!-- OTP content -->
        <section class="my-4 p-4 bg-gray-200">
          <p class="mb-2">Dear User,</p>
          <p class="mb-4">
            Your one-time password (OTP) for accessing your account is:
          </p>
          <div class="bg-white p-4 border border-gray-400 rounded-lg">
            <h2 class="text-xl font-bold mb-2">${OTP}</h2>
          </div>
          <p class="mt-4">
            This OTP is valid for ${validFor} minutes. Please do not share this OTP with anyone.
          </p>
        </section>
  
        <!-- Footer -->
        <footer class="text-center text-gray-500 mt-4">
          <p>
            If you did not request an OTP, please ignore this email.
          </p>
          <p>
            © 2023 Company Name. All rights reserved.
          </p>
        </footer>
      </div>
    </body>
  </html>  
  `;
}

export default getOtpEmailTemplate;