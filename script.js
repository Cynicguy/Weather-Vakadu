const backendURL = 'https://your-backend.onrender.com'; // ✅ Replace with your backend URL

// index.html logic
if (window.location.pathname.includes('index.html')) {
  document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    const res = await fetch(`${backendURL}/send-otp`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, phone })
    });

    const result = await res.json();

    if (result.success) {
      // Store name & phone in localStorage
      localStorage.setItem('name', name);
      localStorage.setItem('phone', phone);
      window.location.href = 'verify.html';
    } else {
      alert('Failed to send OTP: ' + result.message);
    }
  });
}

// verify.html logic
if (window.location.pathname.includes('verify.html')) {
  let seconds = 60;
  const timer = document.getElementById('timer');

  const countdown = setInterval(() => {
    if (seconds > 0) {
      seconds--;
      timer.textContent = `00:${seconds.toString().padStart(2, '0')}`;
    } else {
      clearInterval(countdown);
      timer.textContent = 'OTP expired';
    }
  }, 1000);

  document.getElementById('otp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const otp = document.getElementById('otp').value;
    const name = localStorage.getItem('name');
    const phone = localStorage.getItem('phone');

    const res = await fetch(`${backendURL}/verify-otp`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, phone, otp })
    });

    const result = await res.json();
    if (result.success) {
      alert('Profile created successfully!');
    } else {
      alert('OTP Verification failed: ' + result.message);
    }
  });
}
