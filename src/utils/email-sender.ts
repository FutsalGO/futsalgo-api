import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

function formatDate(date: Date): string {
  const dateStr = date.toISOString();
  const days = [
    "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",
  ];
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const [datePart] = dateStr.split("T");
  if (!datePart) return "";

  const [y, m, d] = datePart.split("-").map(Number);
  if (!y || !m || !d) return "";

  let month = m;
  let year = y;
  if (month < 3) {
    month += 12;
    year -= 1;
  }
  const q = d;
  const K = year % 100;
  const J = Math.floor(year / 100);

  const h =
    (q +
      Math.floor((13 * (month + 1)) / 5) +
      K +
      Math.floor(K / 4) +
      Math.floor(J / 4) +
      5 * J) %
    7;

  const weekdayIndex = (h + 6) % 7;

  return `${days[weekdayIndex]}, ${d} ${months[m - 1]} ${y}`;
}

function formatTime(date: Date): string {
  const dateStr = date.toISOString();
  const timePart = dateStr.split("T")[1];
  if (!timePart) return "00:00";

  const [h = "00", m = "00"] = timePart.split(":");

  const hours = h.padStart(2, "0");
  const minutes = m.padStart(2, "0");

  return `${hours}:${minutes}`;
}


export const sendConfirmedEmail = async (booking: any) => {
  const date = new Date(booking.booking_date);
  const start_time = new Date(booking.start_time);
  const end_time = new Date(booking.end_time);

  const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `FutsalGO <${process.env.ADMIN_EMAIL}>`,
    to: booking?.user?.email,
    subject: 'FutsalGO - Booking Confirmed',
    html: `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        padding: 20px;
      }
      .container {
        background: #ffffff;
        border-radius: 10px;
        padding: 25px;
        max-width: 600px;
        margin: auto;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        border-bottom: 2px solid #4CAF50;
        padding-bottom: 15px;
        margin-bottom: 20px;
      }
      .header h2 {
        color: #4CAF50;
        margin: 0;
      }
      .details {
        margin: 20px 0;
        line-height: 1.6;
      }
      .details strong {
        color: #333;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #777;
        margin-top: 30px;
      }
      .btn {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 20px;
        background: #4CAF50;
        color: #fff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Booking Dikonfirmasi ✅</h2>
      </div>
      <p>Halo <strong>${booking.customer_name}</strong>,</p>
      <p>Terima kasih telah melakukan booking. Berikut detail reservasi Anda:</p>
      
      <div class="details">
        <p><strong>Tanggal:</strong> ${formatDate(date)}</p>
        <p><strong>Waktu:</strong> ${formatTime(start_time)} - ${formatTime(end_time)} WIB</p>
        <p><strong>Nomor Telepon:</strong> ${booking.customer_phone}</p>
        <p><strong>Status:</strong> <span style="color:green;font-weight:bold;">Confirmed</span></p>
      </div>

      <p>Silakan datang sesuai jadwal yang telah ditentukan. Jika ada perubahan, hubungi kami segera.</p>

      <a href="https://wa.me/${process.env.ADMIN_PHONE}"
        class="btn">
        Hubungi via WhatsApp
      </a>

      <div class="footer">
        <p>Pesan ini dibuat otomatis, mohon tidak membalas langsung email ini.</p>
        <p>&copy; ${new Date().getFullYear()} Booking System</p>
      </div>
    </div>
  </body>
</html>
    `
    });
}

export const sendPendingEmail = async (booking: any) => {
  const date = new Date(booking.booking_date);
  const start_time = new Date(booking.start_time);
  const end_time = new Date(booking.end_time);

  const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `FutsalGO <${process.env.ADMIN_EMAIL}>`,
    to: booking?.user?.email,
    subject: 'FutsalGO - Booking Pending',
    html: `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        padding: 20px;
      }
      .container {
        background: #ffffff;
        border-radius: 10px;
        padding: 25px;
        max-width: 600px;
        margin: auto;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        border-bottom: 2px solid #f39c12;
        padding-bottom: 15px;
        margin-bottom: 20px;
      }
      .header h2 {
        color: #f39c12;
        margin: 0;
      }
      .details {
        margin: 20px 0;
        line-height: 1.6;
      }
      .details strong {
        color: #333;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #777;
        margin-top: 30px;
      }
      .btn {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 20px;
        background: #25D366;
        color: #fff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .warning {
        background: #fff3cd;
        border: 1px solid #ffeeba;
        padding: 12px;
        border-radius: 6px;
        color: #856404;
        margin-top: 15px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Pembayaran Diperlukan 💳</h2>
      </div>
      <p>Halo <strong>${booking.customer_name}</strong>,</p>
      <p>Booking Anda telah tercatat. Untuk mengamankan slot, silakan lakukan pembayaran segera. Berikut detail reservasi Anda:</p>
      
      <div class="details">
        <p><strong>Tanggal:</strong> ${formatDate(date)}</p>
        <p><strong>Waktu:</strong> ${formatTime(start_time)} - ${formatTime(end_time)} WIB</p>
        <p><strong>Nomor Telepon:</strong> ${booking.customer_phone}</p>
        <p><strong>Status:</strong> <span style="color:#f39c12;font-weight:bold;">Menunggu Pembayaran</span></p>
      </div>

      <div class="warning">
        ⚠️ <strong>Penting:</strong> Anda memiliki waktu <strong>10 menit</strong> untuk melakukan pembayaran. Jika lewat dari itu, booking akan otomatis dibatalkan.
      </div>

      <a 
        href="https://wa.me/${process.env.ADMIN_PHONE}?text=Halo%20Admin,%20saya%20ingin%20konfirmasi%20pembayaran%20untuk%20booking%20atas%20nama%20${encodeURIComponent(booking.customer_name)}" 
        class="btn"
      >
        Konfirmasi via WhatsApp
      </a>

      <div class="footer">
        <p>Pesan ini dibuat otomatis, mohon tidak membalas langsung email ini.</p>
        <p>&copy; ${new Date().getFullYear()} Booking System</p>
      </div>
    </div>
  </body>
</html>
    `
    });
}