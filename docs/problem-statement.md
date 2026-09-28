# Problem Statement

## Background

Cyber-fraud investigations often involve large amounts of information collected from different sources, including bank transaction records, call logs, phone numbers, device identifiers, account details, timestamps and suspect information.

Although each individual record may contain useful evidence, the real investigative value often appears only when these records are connected together. A bank account may share a device with another account, one account may rapidly transfer received funds to several others, or multiple phone numbers may connect different participants in the same fraud network.

When this information is scattered across separate files and tables, identifying the overall structure of a fraud network becomes difficult.

TRACE addresses this problem within the domain of **cyber-fraud investigation and financial crime analysis**.

## The Problem

Investigators may receive multiple datasets relating to the same cyber-fraud case, but these records do not automatically reveal how the different people, accounts, devices, phone numbers and transactions are connected.

Manually examining these records requires investigators to repeatedly compare transaction histories, device identifiers, call records and account information in order to identify relationships and suspicious patterns.

This makes it difficult to quickly answer questions such as:

- Which accounts are connected?
- How did the money move through the network?
- Are multiple accounts using the same device?
- Which entities act as intermediaries between victims and other accounts?
- Which entities appear central to the network?
- What evidence caused a particular account to be flagged?
- What overall fraud pattern does the available data suggest?

The challenge is therefore not simply storing cyber-fraud data, but **transforming disconnected records into an understandable and explainable investigation network**.

## Who is Affected

The primary users are **cybercrime investigators, digital-forensics analysts and financial-fraud investigation teams** who need to examine relationships across transaction, communication and device data.

For the hackathon prototype, TRACE represents the workflow of an investigator handling a cyber-fraud case containing mock intelligence such as:

- transaction records
- bank accounts
- phone numbers
- call logs
- device identifiers
- suspect or accused names
- timestamps
- victim information

These users need a way to move from raw records to an understandable view of the entire case without manually tracing every relationship.

## Why It Matters

Cyber-fraud networks may involve several accounts, devices and individuals rather than a single isolated transaction.

Important relationships can therefore be difficult to recognize when evidence is viewed only as rows in separate datasets.

Missing or overlooking a connection can make it harder to:

- trace the movement of funds
- identify accounts acting as intermediaries
- discover shared infrastructure such as devices or phone numbers
- understand the hierarchy of a suspected fraud network
- identify high-priority entities for further investigation
- explain why an entity has been flagged
- prepare a clear investigation summary from the available evidence

TRACE aims to reduce this investigative complexity by turning scattered records into a connected visual network and automatically surfacing patterns that may deserve closer examination.

The system does **not determine guilt**. It prioritizes and explains observable indicators so that an investigator can decide what requires further verification.

## Why Existing Solutions Fall Short

A common approach is to examine transaction spreadsheets, call records and device information separately and manually compare identifiers between them.

Spreadsheets and individual tables are useful for viewing records, but they do not naturally show complex relationships across multiple types of evidence.

Traditional dashboards may summarize values such as transaction counts or amounts, but they may still fail to reveal the underlying network structure connecting accounts, people, devices and communications.

Pure AI-based approaches also introduce a different problem: asking a language model to independently interpret raw case data can produce conclusions that are difficult to verify or explain.

TRACE combines these approaches differently:

**Structured data analysis identifies the facts and relationships, graph analysis exposes the network, rule-based logic detects suspicious indicators, and IBM Bob explains those findings to the investigator.**

This creates an investigation-support system where AI assists with interpretation and reporting while the underlying findings remain connected to measurable evidence.
