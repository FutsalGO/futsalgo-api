import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

function formatTime(date: Date): string {
  let hours: number | string = date.getHours();
  let minutes: number | string = date.getMinutes();

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;

  return `${hours}:${minutes}`;
}

export const sendEmail = async (booking: any) => {
    const date = new Date(booking.booking_date);
    const start_time = new Date(booking.start_time);
    const end_time = new Date(booking.end_time);

    const formattedDate = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",   // nama hari penuh (Senin, Selasa, Rabu, dst.)
        day: "numeric",    // tanggal (1–31)
        month: "long",     // nama bulan penuh (Januari, Februari, dst.)
        year: "numeric"    // tahun 4 digit
    }).format(date);

    const transporter = nodemailer.createTransport({
        service: process.env.NODEMAILER_SERVICE,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: process.env.NODEMAILER_FROM,
        to: booking?.user?.email,
        subject: process.env.NODEMAILER_SUBJECT,
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

      <a href="mailto:${process.env.ADMIN_EMAIL}" class="btn">Hubungi Kami</a>

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