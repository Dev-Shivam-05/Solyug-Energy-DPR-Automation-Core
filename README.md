<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&pause=1000&color=16A34A&center=true&vCenter=true&width=800&lines=Solyug+Energy+%7C+Automated+DPR+%26+Lead+Engine;Engineered+for+Speed%2C+Built+for+Scale" alt="Typing SVG" />
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/n8n-FF6D5A?style=for-the-badge&logo=n8n&logoColor=white" />
  <img src="https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logo=zod&logoColor=white" />
</div>

## 🚀 Executive Summary
The **Solyug Automated DPR Engine** is a high-performance, fault-tolerant MERN stack application designed specifically for solar EPC operations. It bridges the gap between field sales and engineering by instantly converting raw site data (Roof Area, Monthly Bill) into mathematically accurate Solar Preliminary Project Reports (DPRs), while simultaneously routing lead data to internal operations via n8n webhooks.

## 🏗️ System Architecture Flow
```mermaid
graph TD
    A[Field Agent: React/Tailwind UI] -->|POST JSON| B(Express.js API Gateway)
    B -->|Zod Validation| C{Math Engine}
    C -->|O1 Compute| D[MongoDB Atlas: System of Record]
    D -->|Sub-200ms Response| A
    D -->|Async Outbox Pattern| E[Background Worker]
    E -->|Webhook| F[n8n Automation]
    F -->|Alerts| G[WhatsApp/Telegram Ops Team]
    F -->|Emails| H[Client PDF Delivery]
```

## 💡 Core Business Features
- ⚡ **Sub-200ms Intake:** Asynchronous background processing ensures the UI never freezes.
- 🧮 **Deterministic Solar Math:** MNRE/CERC compliant thumb-rules for Gujarat irradiation and tariffs.
- 🛡️ **Zero Lead Loss:** The "Outbox Pattern" ensures every lead is persisted to MongoDB before external dispatch.
- 📄 **Client-Side PDF Rendering:** Offloads CPU-heavy PDF generation to the browser, keeping backend costs at zero.

## 🛠️ Tech Stack Decisions
| Technology | Why we chose it for Solyug |
| :--- | :--- |
| **React + Vite** | Instant load times for field agents on 4G networks. |
| **Node/Express** | Non-blocking I/O perfect for handling webhook dispatches. |
| **MongoDB** | Flexible JSON schema allows easy addition of new solar metrics. |
| **Zod** | Strict runtime validation prevents garbage data from entering the CRM. |

---
*Built with ♥ by Shivam Bhadoriya & Team for Solyug Energy.*
