# Solution Overview

## What We Built

TRACE is a **Cyber Fraud Network Analyzer** that helps investigators understand how people, bank accounts, phone numbers, devices and transactions are connected within a cyber-fraud case.

Instead of forcing an investigator to manually compare separate transaction files, call logs and device records, TRACE brings the available information together and represents it as a connected investigation network.

The system can highlight patterns such as:

- rapid movement of funds between accounts
- multiple accounts using the same device
- accounts connected to many other entities
- repeated transfers between related accounts
- multi-step movement of money through several accounts
- entities that appear to act as intermediaries in the network

TRACE then presents these findings through an interactive graph and allows IBM Bob to explain the analysis in investigator-friendly language.

The final output is a structured **FIR-ready investigation brief** containing the important entities, relationships, suspicious indicators and AI-assisted analysis of the case.

TRACE is designed as an **investigation-support system**, not a system that determines whether a person is guilty.

---

## How It Works

1. **The investigator loads a case**

   TRACE receives mock cyber-fraud intelligence containing records such as transactions, call logs, bank accounts, phone numbers, devices, timestamps and accused names.

2. **The data is organized**

   The Python backend cleans and normalizes the records so that information from different files can be analysed together.

3. **Entities and relationships are extracted**

   TRACE identifies entities such as people, accounts, devices and phone numbers.

   It then creates relationships such as:

   `Person → owns → Account`

   `Account → transferred_to → Account`

   `Account → uses → Device`

   `Phone → called → Phone`

4. **A fraud network is created**

   NetworkX converts these entities and relationships into a graph where entities become nodes and their connections become edges.

5. **Suspicious patterns are analysed**

   The Python fraud-analysis engine checks the network for indicators such as rapid fund movement, shared devices, multiple recipients, high network connectivity and multi-hop transaction paths.

6. **Potential investigation roles are identified**

   Based on the observable patterns, TRACE may identify entities as potential victims, mule-like entities or central network entities requiring further investigation.

7. **The network is visualized**

   Cytoscape.js displays the case as an interactive network graph where investigators can click an entity and inspect its transactions, connections and risk indicators.

8. **IBM Bob assists the investigator**

   Through the MCP tool layer, IBM Bob can request structured information from TRACE and answer investigation-oriented questions such as:

   - Why was this account flagged?
   - Which entities are connected to this account?
   - What suspicious patterns appear in this case?
   - How did funds move through the network?

9. **An investigation brief is generated**

   TRACE combines network findings, risk indicators, important relationships and Bob-assisted explanations into a structured FIR-ready case brief.

---

## Architecture Diagram

> See [`architecture.md`](architecture.md) for the detailed system architecture.

A simplified view of the TRACE workflow is:

```text
[Investigator]
      |
      v
[TRACE Frontend]
      |
      v
[FastAPI Backend]
      |
      v
[CSV / JSON Fraud Data]
      |
      v
[Entity & Relationship Extraction]
      |
      v
[NetworkX Fraud Graph]
      |
      v
[Fraud Analysis Engine]
      |
      +-----------------------+
      |                       |
      v                       v
[Cytoscape.js]          [MCP Tool Layer]
[Interactive Graph]           |
                              v
                         [IBM Bob]
                              |
                              v
                   [AI-Assisted Explanation]
                              |
                              v
                   [Investigation Brief]
```

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Use NetworkX to represent the fraud network | Cyber-fraud investigations naturally involve relationships between people, accounts, devices and transactions. A graph structure makes these connections easier to analyse than isolated tables. |
| Use rule-based Python analysis before AI | Measurable indicators such as transaction timing, shared devices and connection counts can be calculated reliably without relying on AI-generated guesses. |
| Use IBM Bob for interpretation rather than primary detection | Bob receives structured findings from TRACE and explains them in natural language, keeping the underlying fraud indicators grounded in actual analysis. |
| Use MCP as the integration layer between Bob and TRACE | MCP allows Bob to request specific investigation information through controlled tools instead of giving it unrestricted access to the application. |
| Use Cytoscape.js for network visualization | Interactive graph visualization allows investigators to explore complex relationships visually and inspect individual entities. |
| Use FastAPI as the backend | FastAPI provides a lightweight Python API layer that can connect the frontend, graph engine, analysis logic and Bob integration. |
| Use CSV / JSON data for the hackathon prototype | Lightweight local files make the prototype easier to build and demonstrate while still supporting realistic cyber-fraud scenarios. |
| Keep the investigator in the loop | TRACE presents suspicious indicators and potential roles rather than making definitive criminal or legal conclusions. |

---

## IBM Technologies Used

### IBM Bob

IBM Bob is used as the **AI-assisted investigation layer** within TRACE.

The core fraud analysis is first performed by the Python and NetworkX components. Bob then receives structured findings such as entity connections, transaction patterns, risk indicators and potential investigation roles.

Bob can use this information to:

- explain why an entity has been flagged
- summarize suspicious network patterns
- describe relationships between entities
- help investigators understand fund-flow paths
- identify areas that may require further investigation
- assist in generating the final investigation brief

This means Bob is not being asked to independently decide whether an account or person is fraudulent. Instead, it interprets analysis already produced by TRACE.

### Model Context Protocol (MCP)

MCP is used as the **bridge between IBM Bob and the TRACE investigation engine**.

TRACE exposes specific investigation functions that Bob can call, such as:

```text
inspect_entity(entity_id)

find_relationships(entity_id)

trace_fund_flow(account_id)

get_risk_indicators(entity_id)

get_high_priority_entities()

generate_case_brief(case_id)
```

For example, if an investigator asks:

> Why is ACC004 considered high priority?

Bob can request the structured analysis for `ACC004` through an MCP tool.

TRACE may return information such as:

```text
Risk Level: HIGH

Indicators:
- Rapid fund movement
- Shared device
- Multiple recipients
- High network connectivity
```

Bob then converts those findings into a clear investigation-oriented explanation.

This allows IBM Bob to function as an intelligent interface to the TRACE analysis engine rather than as a standalone chatbot.

## Core Principle

TRACE follows one important design principle:

**The analysis engine discovers the evidence. IBM Bob explains the evidence. The investigator makes the decision.**
