# 🕵️ Cyber Fraud Network Analyzer

> An AI-assisted investigation tool for discovering connections, suspicious patterns, and potential roles within cyber-fraud networks.

---

## 👥 Team

| Field | Value |
|---|---|
| **Team Name** | Powerpuff-Girls |
| **Track** | AI |
| **Team Lead** | Tia Vadvania — tvadvania@gmail.com |
| **Members** | Tia Vadvania, Riya Lalwani, Sakshi Khairnar|

---

## 🎯 Problem Statement

> In 2–3 sentences: What problem does your project solve? Who experiences this problem?

Cyber-fraud investigations often involve scattered information such as bank transactions, call records, phone numbers, device IDs, account numbers, names, and timestamps. The main challenge is understanding how these different pieces of information are connected.

Our Cyber Fraud Network Analyzer helps investigators organize this information, identify entities and relationships, visualize them as a network, and detect suspicious patterns such as rapid fund movement and multiple accounts sharing the same device.

---

## 💡 Solution

> In 2–3 sentences: What did you build? How does it solve the problem above?

> Our solution is a Cyber Fraud Network Analyzer that converts scattered fraud-related data into a connected network of entities and relationships. The system analyzes transactions, phone numbers, devices, accounts, people, and timestamps to identify suspicious patterns such as rapid fund movement and shared devices, then uses IBM Bob to explain the analysis and generate an investigation brief.

The system follows the flow: **Data → Connections → Network → Suspicious Patterns → Investigation → AI-Assisted Report**.

---

## ✨ Key Features

- **Entity Extraction:** Identifies people, bank accounts, phone numbers, devices, and transaction-related entities from fraud data.
- **Relationship Analysis:** Discovers connections such as account ownership, money transfers, phone associations, and shared devices.
- **Fraud Network Visualization:** Represents entities and relationships as an interactive network of nodes and connections.
- **Suspicious Pattern Detection:** Identifies indicators such as rapid fund movement and multiple accounts connected to the same device.
- **AI-Assisted Investigation Brief:** Uses IBM Bob to explain network findings and generate a structured investigation brief for investigators.

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
# 1. Clone the repo
git clone https://github.com/[your-repo].git
cd [your-repo]

# 2. Install dependencies
[your install command here]

# 3. Configure environment
cp .env.example .env
# Edit .env with your values

# 4. Run the project
[your run command here]
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

> Be honest — judges appreciate transparency over overclaiming.

- [Limitation 1: e.g., "Authentication is mocked — not production-ready"]
- [Limitation 2: e.g., "Only tested on Chrome"]
- [Limitation 3: e.g., "Feature X is scaffolded but not fully implemented"]

---

## 🏅 What We're Most Proud Of

[Tell the judges what part of your submission is strongest and worth paying close attention to.]

---
