# 🕵️ Cyber Fraud Network Analyzer

> An AI-assisted investigation tool for discovering connections, suspicious patterns, and potential roles within cyber-fraud networks.

---

## 👥 Team

| Field | Value |
|---|---|
| **Team Name** | Powerpuff-Girls |
| **Track** | AI, Cyber Forensics |
| **Team Lead** | Tia Vadvania — tvadvania@gmail.com |
| **Members** | Tia Vadvania, Riya Lalwani, Sakshi Khairnar|

---

## 🎯 Problem Statement

Cyber-fraud investigations often involve scattered information such as bank transactions, call records, phone numbers, device IDs, account numbers, names, and timestamps. The main challenge is understanding how these different pieces of information are connected.

Our Cyber Fraud Network Analyzer helps investigators organize this information, identify entities and relationships, visualize them as a network, and detect suspicious patterns such as rapid fund movement and multiple accounts sharing the same device.

---

## 💡 Solution

> Our solution is a Cyber Fraud Network Analyzer that converts scattered fraud-related data into a connected network of entities and relationships. The system analyzes transactions, phone numbers, devices, accounts, people, and timestamps to identify suspicious patterns such as rapid fund movement and shared devices, then uses IBM Bob to explain the analysis and generate an investigation brief.

The system follows the flow: **Data → Connections → Network → Suspicious Patterns → Investigation → AI-Assisted Report**.

---


## ✨ Key Features

- **High Connectivity Analysis:** Uses degree centrality to identify entities connected to many other entities in the fraud network.
- **Network Position Analysis:** Uses betweenness centrality to identify entities that connect different parts of the network.
- **Money-Flow Imbalance Detection:** Compares the total money received and sent by an account to highlight unusual financial-flow patterns.
- **Shared-Device Detection:** Identifies multiple accounts associated with the same device identifier.
- **Investigation Support:** Organizes detected patterns into useful findings to help investigators prioritize further examination.

> **Note:** These indicators highlight potential investigation leads. They do not independently prove fraud or establish that an entity is a kingpin or money mule.
---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Languages** | Python |
| **Libraries** | NetworkX |
| **IBM Technologies** | IBM Bob, MCP |
| **Data** | Mock / File-based Fraud Data |
| **Other** | Git, GitHub |

---

## 📁 Repository Structure

```
├── src/                  # All source code
├── docs/                 # Written documentation
│   ├── problem-statement.md
│   ├── solution-overview.md
│   ├── architecture.md
│   └── setup-guide.md
├── demo/                 # Demo artifacts
│   ├── screenshots/      # App screenshots
│   └── demo-video-link.txt  # Link to demo video
├── presentation/         # Slide deck
└── submission.yaml       # Structured submission metadata
```

---

## ⚡ How to Run

> **Copy these exact steps from your [`docs/setup-guide.md`](docs/setup-guide.md)**

```bash
## 🚀 How to Run

Follow these steps to run **TRACE – Cyber Fraud Network Analyzer** on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/14sakshiiik/bob-ai-hackathon-Powerpuff-Girls.git
cd bob-ai-hackathon-Powerpuff-Girls
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

If your project contains a `.env.example` file, create a `.env` file and add the required configuration values.

```bash
cp .env.example .env
```

**Note:** Never upload API keys or secret credentials to GitHub.

### 4. Run the Application

```bash
python app.py
```

### 5. Open the Dashboard

Open your browser and visit:

```text
http://127.0.0.1:5000
```

Explore TRACE's network summary, account risk details, transaction relationships, and shared-device indicators using the available demonstration data.

```

---

## 🖥️ Demo

| Artifact | Link |
|---|---|
| 📹 Demo Video | [See demo/demo-video-link.txt](demo/demo-video-link.txt) |
| 🌐 Live Demo | [See demo/live-demo-url.txt](demo/live-demo-url.txt) |
| 🖼️ Screenshots | [See demo/screenshots/](demo/screenshots/) |
| 📊 Presentation | [See presentation/slides.pdf](presentation/) |

---


## ⚠️ Known Limitations

- **Mock Data Only:** TRACE uses demonstration CSV/JSON data, not real banking, telecom, victim, or police records.
- **Basic Security:** The prototype does not include full authentication, role-based access control, or investigator account management.
- **Input Validation:** File inputs require validation and are not designed for untrusted production data.
- **Secure Integration:** IBM Bob/MCP access should be restricted to specific investigation functions, with API keys stored in environment variables and excluded from GitHub.
- **AI and Analysis Boundaries:** Python performs deterministic analysis, while AI explains findings. Risk levels and network roles are investigative indicators, not proof of guilt; human review is required.
- **Production Readiness:** Enterprise-grade encryption, audit logging, secure storage, secrets management, and fine-grained permissions are not fully implemented.

> **Future Scope:** Production deployment would require stronger authentication, access controls, encrypted data handling, audit trails, and secure case management.

---

## 🏅 What We're Most Proud Of

-We are most proud of TRACE's approach to connecting scattered cyber-fraud records into an understandable investigation network. By combining graph analysis, money-flow analysis, and shared-device detection, our project aims to help investigators discover meaningful relationships and prioritize potential leads. We are building a practical, responsible prototype that supports human investigation rather than automatically judging guilt.


---
