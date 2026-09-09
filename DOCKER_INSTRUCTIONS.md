# 🚀 SAHYOG Platform - Docker Run Guide

Share this guide with your friend or teammates. They can run the entire platform with just **one command**!

---

## ⚡ Quick Start (सिर्फ 1 कमांड में चलाएं)

### Option 1: Using Docker Run (Direct)

Copy and run this command in Terminal / PowerShell / Command Prompt:

```bash
docker run -d -p 80:80 --name sahyog-platform mukul2026k/sahyog-app:latest
```

Then open your browser at:
👉 **`http://localhost`** (or **`http://127.0.0.1`**)

---

### Option 2: If Port 80 is Already in Use (वैकल्पिक पोर्ट 8080)

If your computer is already using port 80 (e.g. IIS or Apache), run on port 8080:

```bash
docker run -d -p 8080:80 --name sahyog-platform mukul2026k/sahyog-app:latest
```

Then open your browser at:
👉 **`http://localhost:8080`**

---

### Option 3: Using Docker Compose

1. Create a `docker-compose.yml` file with this content:
   ```yaml
   services:
     sahyog-app:
       image: mukul2026k/sahyog-app:latest
       container_name: sahyog-platform
       restart: unless-stopped
       ports:
         - "80:80"
   ```
2. Run:
   ```bash
   docker compose up -d
   ```
3. Open **`http://localhost`**

---

## 🛑 Useful Management Commands

* **Stop the container (रोकें)**:
  ```bash
  docker stop sahyog-platform
  ```

* **Start again (पुनः चालू करें)**:
  ```bash
  docker start sahyog-platform
  ```

* **Remove container (हटाएं)**:
  ```bash
  docker rm -f sahyog-platform
  ```

* **Pull latest updates (नया अपडेट लें)**:
  ```bash
  docker pull mukul2026k/sahyog-app:latest
  ```

---

## 📱 WhatsApp / Message to Send to Your Friend (सीधे कॉपी करके भेजें):

```
नमस्ते भाई! सहयोग (SAHYOG) लोकल कोऑपरेटिव प्लेटफॉर्म की प्रोडक्शन डॉकर इमेज तैयार है। 

अपने सिस्टम में डॉकर टर्मिनल पर बस यह एक कमांड चलाओ:

docker run -d -p 80:80 --name sahyog-platform mukul2026k/sahyog-app:latest

इसके बाद ब्राउज़र में खोलो:
👉 http://localhost

(नोट: अगर पोर्ट 80 बिजी हो तो 80:80 की जगह 8080:80 कर लेना और http://localhost:8080 खोलना)
```
