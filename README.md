# 🤝 SAHYOG - Worker-Owned Local Cooperative Platform

> **Smart India Hackathon (SIH 2026)**
> An innovative decentralized, 100% worker-owned local cooperative platform built for grassroots tradespeople, offering fair direct pricing, ₹0 platform commissions, escrow milestone payouts, and multilingual voice-first booking.

---

## 🌟 Key Features

* **100% Worker-Owned Cooperative**: ₹0 platform commissions. All earnings go directly to local verified member-owners.
* **Smart Voice-First Booking (Bharat AI Voice Search)**: Speak in Hindi, English, Kannada, Marathi, or Tamil to book services without typing.
* **Practical Skill Assessment & Workshop Proofs**: Designed for informal artisans without formal degrees/e-Shram cards — includes 2-min live demonstration videos, physical workshop photos, and peer guarantors.
* **Dynamic Multi-City & Location Switching**: Pre-configured chapters for **Sultanpur (default)**, **Lucknow**, **Varanasi**, and **Bengaluru** with one-tap GPS auto-detection and locality filters.
* **RBI-Compliant Escrow Vault**: Customer deposits are secured until service completion; released via worker 4-digit PIN with dispute arbitration.
* **Role-Based Perspectives**: Instant switching between **Customer / Resident**, **Worker-Owner**, and **Cooperative Admin** dashboards.

---

## 🐳 Quick Run with Docker

Run the entire production platform in one command:

```bash
docker run -d -p 80:80 --name sahyog-platform mukul2026k/sahyog-app:latest
```

Open your browser at:
👉 **`http://localhost`**

Or using Docker Compose:
```bash
docker compose up -d
```

---

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mukul953kumar/sahyog-sih.git
   cd sahyog-sih
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🛠️ Tech Stack

* **Frontend**: React 19, Vite 8, TailwindCSS
* **Containerization**: Docker (Node 20 Alpine Builder + Nginx Alpine Runner)
* **Web Server**: Nginx with custom SPA routing, Gzip, and static asset caching
* **Internationalization**: Custom multilingual engine (EN, HI, KN, MR, TA)
* **State Management**: Zero-database in-memory + local storage persistence
