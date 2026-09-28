// =====================================================
// TRACE — NETWORK ANALYZER FRONTEND
// =====================================================

// Flask backend
const API_BASE = "http://127.0.0.1:5000";


// =====================================================
// GLOBAL DATA
// =====================================================

let accountsData = [];
let riskData = [];
let devicesData = [];
let summaryData = {};

let networkData = {
    nodes: [],
    edges: []
};


// =====================================================
// DOM HELPER
// =====================================================

function getElement(id) {
    return document.getElementById(id);
}


// =====================================================
// DOM ELEMENTS
// =====================================================

const totalEntities =
    getElement("totalEntities");

const totalTransactions =
    getElement("totalTransactions");

const flaggedEntities =
    getElement("flaggedEntities");

const networkRisk =
    getElement("networkRisk");

const entityDescription =
    getElement("entityDescription");

const transactionDescription =
    getElement("transactionDescription");

const flaggedDescription =
    getElement("flaggedDescription");

const networkRiskDescription =
    getElement("networkRiskDescription");


// =====================================================
// LOAD DASHBOARD DATA
// =====================================================

async function loadDashboard() {

    try {

        console.log(
            "TRACE: Loading backend data..."
        );


        // =================================================
        // SUMMARY
        // =================================================

        const summaryResponse =
            await fetch(
                `${API_BASE}/api/summary`
            );


        if (!summaryResponse.ok) {

            throw new Error(
                "Unable to load summary data"
            );

        }


        summaryData =
            await summaryResponse.json();


        // =================================================
        // ACCOUNTS
        // =================================================

        const accountsResponse =
            await fetch(
                `${API_BASE}/api/accounts`
            );


        if (!accountsResponse.ok) {

            throw new Error(
                "Unable to load account data"
            );

        }


        accountsData =
            await accountsResponse.json();


        // =================================================
        // RISK
        // =================================================

        const riskResponse =
            await fetch(
                `${API_BASE}/api/risk`
            );


        if (!riskResponse.ok) {

            throw new Error(
                "Unable to load risk data"
            );

        }


        riskData =
            await riskResponse.json();


        // =================================================
        // DEVICES
        // =================================================

        const devicesResponse =
            await fetch(
                `${API_BASE}/api/devices`
            );


        if (!devicesResponse.ok) {

            throw new Error(
                "Unable to load device data"
            );

        }


        devicesData =
            await devicesResponse.json();


        // =================================================
        // NETWORK
        // =================================================

        const networkResponse =
            await fetch(
                `${API_BASE}/api/network`
            );


        if (!networkResponse.ok) {

            throw new Error(
                "Unable to load network data"
            );

        }


        networkData =
            await networkResponse.json();


        // =================================================
        // DEBUG INFORMATION
        // =================================================

        console.log(
            "TRACE: Backend data loaded successfully."
        );

        console.log(
            "Summary:",
            summaryData
        );

        console.log(
            "Accounts:",
            accountsData
        );

        console.log(
            "Risk:",
            riskData
        );

        console.log(
            "Devices:",
            devicesData
        );

        console.log(
            "Network:",
            networkData
        );


        // =================================================
        // UPDATE UI
        // =================================================

        updateDashboard();

        buildNetwork();


    }
    catch (error) {

        console.error(
            "TRACE backend error:",
            error
        );

        showBackendError();

    }

}


// =====================================================
// UPDATE DASHBOARD STATISTICS
// =====================================================

function updateDashboard() {

    // -------------------------------------------------
    // TOTAL ENTITIES
    // -------------------------------------------------

    const entities =
        (summaryData.accounts || 0) +
        (summaryData.persons || 0) +
        (summaryData.devices || 0);


    if (totalEntities) {

        totalEntities.textContent =
            entities;

    }


    if (entityDescription) {

        entityDescription.textContent =
            `${summaryData.accounts || 0} accounts · ` +
            `${summaryData.persons || 0} persons · ` +
            `${summaryData.devices || 0} devices`;

    }


    // -------------------------------------------------
    // TRANSACTIONS
    // -------------------------------------------------

    if (totalTransactions) {

        totalTransactions.textContent =
            summaryData.transactions || 0;

    }


    if (transactionDescription) {

        transactionDescription.textContent =
            "Transaction records analyzed";

    }


    // -------------------------------------------------
    // FLAGGED ENTITIES
    // -------------------------------------------------

    const flagged =
        getFlaggedAccounts();


    if (flaggedEntities) {

        flaggedEntities.textContent =
            flagged.length;

    }


    if (flaggedDescription) {

        flaggedDescription.textContent =
            "Accounts requiring investigation";

    }


    // -------------------------------------------------
    // NETWORK RISK
    // -------------------------------------------------

    const riskLevel =
        calculateOverallRisk();


    if (networkRisk) {

        networkRisk.textContent =
            riskLevel;

    }


    if (networkRiskDescription) {

        networkRiskDescription.textContent =
            "Based on account risk analysis";

    }

}


// =====================================================
// GET FLAGGED ACCOUNTS
// =====================================================

function getFlaggedAccounts() {

    if (!Array.isArray(riskData)) {

        return [];

    }


    return riskData.filter(
        item => {

            const risk =
                String(
                    item.risk ||
                    item.risk_level ||
                    item.level ||
                    ""
                ).toUpperCase();


            return (
                risk === "HIGH" ||
                risk === "CRITICAL" ||
                risk === "MEDIUM"
            );

        }
    );

}


// =====================================================
// CALCULATE OVERALL RISK
// =====================================================

function calculateOverallRisk() {

    if (
        !Array.isArray(riskData) ||
        riskData.length === 0
    ) {

        return "LOW";

    }


    let high = 0;
    let medium = 0;


    riskData.forEach(
        item => {

            const risk =
                String(
                    item.risk ||
                    item.risk_level ||
                    item.level ||
                    ""
                ).toUpperCase();


            if (
                risk === "HIGH" ||
                risk === "CRITICAL"
            ) {

                high++;

            }
            else if (
                risk === "MEDIUM"
            ) {

                medium++;

            }

        }
    );


    if (high > 0) {

        return "HIGH";

    }


    if (medium > 0) {

        return "MEDIUM";

    }


    return "LOW";

}


// =====================================================
// BUILD NETWORK
// =====================================================

function buildNetwork() {

    const canvas =
        getElement("networkCanvas");


    if (!canvas) {

        console.warn(
            "TRACE: networkCanvas not found."
        );

        return;

    }


    // Clear old graph
    canvas.innerHTML = "";


    // -------------------------------------------------
    // Validate data
    // -------------------------------------------------

    if (
        !networkData ||
        !Array.isArray(networkData.nodes) ||
        !Array.isArray(networkData.edges)
    ) {

        showEmptyNetwork();

        return;

    }


    if (
        networkData.nodes.length === 0
    ) {

        showEmptyNetwork();

        return;

    }


    // -------------------------------------------------
    // Make sure canvas can contain absolute elements
    // -------------------------------------------------

    canvas.style.position =
        "relative";


    // -------------------------------------------------
    // SVG CONNECTION LAYER
    // -------------------------------------------------

    const svg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );


    svg.classList.add(
        "network-lines"
    );


    svg.setAttribute(
        "viewBox",
        "0 0 1000 500"
    );


    svg.setAttribute(
        "preserveAspectRatio",
        "none"
    );


    svg.style.position =
        "absolute";


    svg.style.left =
        "0";


    svg.style.top =
        "0";


    svg.style.width =
        "100%";


    svg.style.height =
        "100%";


    svg.style.pointerEvents =
        "none";


    svg.style.overflow =
        "visible";


    canvas.appendChild(
        svg
    );


    // -------------------------------------------------
    // CALCULATE POSITIONS
    // -------------------------------------------------

    const positions =
        calculateNetworkPositions(
            networkData.nodes
        );


    // -------------------------------------------------
    // DRAW EDGES
    // -------------------------------------------------

    drawNetworkEdges(
        svg,
        networkData.edges,
        positions
    );


    // -------------------------------------------------
    // DRAW NODES
    // -------------------------------------------------

    networkData.nodes.forEach(
        nodeData => {

            const position =
                positions[nodeData.id];


            if (!position) {

                return;

            }


            createNetworkNode(
                canvas,
                nodeData,
                position
            );

        }
    );

}


// =====================================================
// CALCULATE NETWORK POSITIONS
// =====================================================

function calculateNetworkPositions(nodes) {

    const positions = {};


    if (nodes.length === 0) {

        return positions;

    }


    // -------------------------------------------------
    // Canvas coordinate system
    // -------------------------------------------------

    const centerX = 500;
    const centerY = 250;

    const radiusX = 330;
    const radiusY = 165;


    // -------------------------------------------------
    // Find highest PageRank entity
    // -------------------------------------------------

    let centralNode =
        nodes[0];


    let highestPageRank =
        -1;


    nodes.forEach(
        node => {

            const account =
                accountsData.find(
                    item =>
                        item.account_id ===
                        node.id
                );


            const pageRank =
                Number(
                    account?.pagerank || 0
                );


            if (
                pageRank >
                highestPageRank
            ) {

                highestPageRank =
                    pageRank;

                centralNode =
                    node;

            }

        }
    );


    // -------------------------------------------------
    // Central node
    // -------------------------------------------------

    positions[
        centralNode.id
    ] = {

        x: centerX,
        y: centerY

    };


    // -------------------------------------------------
    // Remaining nodes
    // -------------------------------------------------

    const remainingNodes =
        nodes.filter(
            node =>
                node.id !==
                centralNode.id
        );


    remainingNodes.forEach(
        (node, index) => {

            const angle =
                (
                    index /
                    remainingNodes.length
                ) *
                Math.PI *
                2;


            positions[
                node.id
            ] = {

                x:
                    centerX +
                    Math.cos(angle) *
                    radiusX,

                y:
                    centerY +
                    Math.sin(angle) *
                    radiusY

            };

        }
    );


    return positions;

}


// =====================================================
// DRAW NETWORK EDGES
// =====================================================

function drawNetworkEdges(
    svg,
    edges,
    positions
) {

    edges.forEach(
        edge => {

            const source =
                positions[
                    edge.source
                ];


            const target =
                positions[
                    edge.target
                ];


            if (
                !source ||
                !target
            ) {

                return;

            }


            // -------------------------------------------------
            // Create line
            // -------------------------------------------------

            const line =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "line"
                );


            line.setAttribute(
                "x1",
                source.x
            );


            line.setAttribute(
                "y1",
                source.y
            );


            line.setAttribute(
                "x2",
                target.x
            );


            line.setAttribute(
                "y2",
                target.y
            );


            // -------------------------------------------------
            // Amount
            // -------------------------------------------------

            const amount =
                Number(
                    edge.amount || 0
                );


            // -------------------------------------------------
            // Edge thickness
            // -------------------------------------------------

            let width = 1.5;


            if (
                amount >= 100000
            ) {

                width = 4;

            }
            else if (
                amount >= 50000
            ) {

                width = 3;

            }
            else if (
                amount >= 25000
            ) {

                width = 2;

            }


            line.setAttribute(
                "stroke-width",
                width
            );


            line.classList.add(
                "network-edge"
            );


            // -------------------------------------------------
            // Data attributes
            // -------------------------------------------------

            line.dataset.source =
                edge.source;


            line.dataset.target =
                edge.target;


            line.dataset.amount =
                amount;


            line.dataset.transaction =
                edge.transaction_id ||
                "";


            // -------------------------------------------------
            // Tooltip
            // -------------------------------------------------

            const title =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "title"
                );


            title.textContent =
                `${edge.source} → ${edge.target} | ₹${formatMoney(amount)}`;


            line.appendChild(
                title
            );


            svg.appendChild(
                line
            );

        }
    );

}


// =====================================================
// CREATE NETWORK NODE
// =====================================================

function createNetworkNode(
    canvas,
    nodeData,
    position
) {

    const node =
        document.createElement("div");


    node.className =
        "network-node";


    node.dataset.account =
        nodeData.id;


    // -------------------------------------------------
    // Find account data
    // -------------------------------------------------

    const account =
        accountsData.find(
            item =>
                item.account_id ===
                nodeData.id
        );


    // -------------------------------------------------
    // Find risk
    // -------------------------------------------------

    const risk =
        getAccountRisk(
            nodeData.id
        );


    const riskLevel =
        getRiskLevel(
            risk
        );


    // -------------------------------------------------
    // Central entity
    // -------------------------------------------------

    const highestPageRank =
        getHighestPageRank();


    const accountPageRank =
        Number(
            account?.pagerank || 0
        );


    const isCentral =
        account &&
        accountPageRank ===
        highestPageRank;


    // -------------------------------------------------
    // Apply classes
    // -------------------------------------------------

    if (isCentral) {

        node.classList.add(
            "kingpin"
        );

    }
    else if (
        riskLevel === "HIGH" ||
        riskLevel === "CRITICAL"
    ) {

        node.classList.add(
            "mule"
        );

    }
    else if (
        riskLevel === "MEDIUM"
    ) {

        node.classList.add(
            "medium-risk"
        );

    }


    // -------------------------------------------------
    // Icon
    // -------------------------------------------------

    let icon = "🏦";


    if (isCentral) {

        icon = "👤";

    }
    else if (
        riskLevel === "HIGH" ||
        riskLevel === "CRITICAL"
    ) {

        icon = "⚠";

    }


    // -------------------------------------------------
    // Label
    // -------------------------------------------------

    let subtitle =
        "Connected Account";


    if (isCentral) {

        subtitle =
            "Central Entity";

    }
    else if (
        riskLevel === "HIGH" ||
        riskLevel === "CRITICAL"
    ) {

        subtitle =
            "Potential Mule";

    }
    else if (
        riskLevel === "MEDIUM"
    ) {

        subtitle =
            "Monitored Account";

    }
    else if (
        riskLevel
    ) {

        subtitle =
            "Low Risk";

    }


    // -------------------------------------------------
    // HTML
    // -------------------------------------------------

    node.innerHTML = `
    <span class="network-node-icon">
        ${icon}
    </span>

    <strong>
        ${nodeData.id}
    </strong>

    <small>
        ${subtitle}
    </small>

    ${
        riskLevel
            ? `
                <span class="node-risk">
                    <span class="node-risk-dot"></span>
                    ${riskLevel}
                </span>
              `
            : ""
    }
`;


    // -------------------------------------------------
    // Position
    // -------------------------------------------------

    node.style.position =
        "absolute";


    node.style.left =
        `${position.x / 10}%`;


    node.style.top =
        `${position.y / 5}%`;


    node.style.transform =
        "translate(-50%, -50%)";


    // -------------------------------------------------
    // Click
    // -------------------------------------------------

    node.addEventListener(
        "click",
        () => {

            if (account) {

                openEntityPanel(
                    account
                );

            }

        }
    );


    // -------------------------------------------------
    // Hover
    // -------------------------------------------------

    node.addEventListener(
        "mouseenter",
        () => {

            highlightConnections(
                nodeData.id
            );

        }
    );


    node.addEventListener(
        "mouseleave",
        () => {

            clearConnectionHighlight();

        }
    );


    canvas.appendChild(
        node
    );

}


// =====================================================
// GET HIGHEST PAGERANK
// =====================================================

function getHighestPageRank() {

    if (
        !Array.isArray(accountsData) ||
        accountsData.length === 0
    ) {

        return 0;

    }


    return Math.max(
        ...accountsData.map(
            account =>
                Number(
                    account.pagerank || 0
                )
        )
    );

}


// =====================================================
// HIGHLIGHT NODE CONNECTIONS
// =====================================================

function highlightConnections(
    accountId
) {

    const lines =
        document.querySelectorAll(
            ".network-edge"
        );


    lines.forEach(
        line => {

            const isConnected =
                line.dataset.source ===
                    accountId ||
                line.dataset.target ===
                    accountId;


            if (isConnected) {

                line.style.opacity =
                    "1";

                line.style.filter =
                    "drop-shadow(0 0 5px currentColor)";

            }
            else {

                line.style.opacity =
                    "0.15";

            }

        }
    );

}


// =====================================================
// CLEAR CONNECTION HIGHLIGHT
// =====================================================

function clearConnectionHighlight() {

    const lines =
        document.querySelectorAll(
            ".network-edge"
        );


    lines.forEach(
        line => {

            line.style.opacity =
                "";

            line.style.filter =
                "";

        }
    );

}


// =====================================================
// GET ACCOUNT RISK
// =====================================================

function getAccountRisk(accountId) {

    if (!Array.isArray(riskData)) {
        return null;
    }

    const risk = riskData.find(item => {

        return (
            item.account_id === accountId ||
            item.account === accountId ||
            item.id === accountId ||
            item.entity_id === accountId ||
            item.entity === accountId
        );

    }) || null;

    console.log(
        "TRACE Risk lookup:",
        accountId,
        risk
    );

    return risk;
}


// =====================================================
// GET RISK LEVEL
// =====================================================

function getRiskLevel(risk) {

    if (!risk) {
        return "";
    }

    const raw =
        risk.risk_level ??
        risk.risk ??
        risk.level ??
        risk.riskLevel ??
        risk.risk_category ??
        risk.category ??
        "";

    const level =
        String(raw)
            .trim()
            .toUpperCase();

    if (level.includes("CRITICAL")) {
        return "CRITICAL";
    }

    if (level.includes("HIGH")) {
        return "HIGH";
    }

    if (level.includes("MEDIUM")) {
        return "MEDIUM";
    }

    if (level.includes("LOW")) {
        return "LOW";
    }

    return "";
}

// =====================================================
// OPEN ENTITY PANEL
// =====================================================

function openEntityPanel(
    account
) {
        window.selectedAccountId = account.account_id;

    const panel =
        getElement("entityPanel");


    const overlay =
        getElement("entityOverlay");


    if (!panel) {

        console.warn(
            "TRACE: entityPanel not found."
        );

        return;

    }


    const risk =
        getAccountRisk(
            account.account_id
        );


    // -------------------------------------------------
    // Basic information
    // -------------------------------------------------

    const entityId =
        getElement("entityId");


    if (entityId) {

        entityId.textContent =
            account.account_id;

    }


    const entityIcon =
        getElement("entityIcon");


    if (entityIcon) {

        entityIcon.textContent =
            "🏦";

    }


    const entityType =
        getElement("entityType");


    if (entityType) {

        entityType.textContent =
            "Bank Account";

    }


    const entityRole =
        getElement("entityRole");


    if (entityRole) {

        entityRole.textContent =
            getRoleFromRisk(
                risk
            );

    }


    // -------------------------------------------------
    // Risk
    // -------------------------------------------------

    const riskLevel =
        getRiskLevel(
            risk
        ) || "UNKNOWN";


    const entityRisk =
        getElement("entityRisk");


    if (entityRisk) {

        entityRisk.textContent =
            riskLevel;

    }


    updateRiskBar(
        riskLevel
    );


    // -------------------------------------------------
    // Connections
    // -------------------------------------------------

    const entityConnections =
        getElement(
            "entityConnections"
        );


    if (entityConnections) {

        entityConnections.textContent =
            account.connections?.total || 0;

    }


    // -------------------------------------------------
    // Transactions
    // -------------------------------------------------

    const entityTransactions =
        getElement(
            "entityTransactions"
        );


    if (entityTransactions) {

        const incoming =
            account.connections?.incoming || 0;

        const outgoing =
            account.connections?.outgoing || 0;


        entityTransactions.textContent =
            incoming + outgoing;

    }


    // -------------------------------------------------
    // Devices
    // -------------------------------------------------

    const entityDevices =
        getElement(
            "entityDevices"
        );


    if (entityDevices) {

        entityDevices.textContent =
            getDeviceCount(
                account.account_id
            );

    }


    // -------------------------------------------------
    // Indicators
    // -------------------------------------------------

    updateEntityIndicators(
        risk
    );


    // -------------------------------------------------
    // Connected accounts
    // -------------------------------------------------

    updateConnectedEntities(
        account
    );


    // -------------------------------------------------
    // Show panel
    // -------------------------------------------------

    panel.classList.add(
        "open"
    );


    if (overlay) {

        overlay.classList.add(
            "active"
        );

    }

}


// =====================================================
// ENTITY ROLE
// =====================================================

function getRoleFromRisk(
    risk
) {

    const level =
        getRiskLevel(
            risk
        );


    if (
        level === "HIGH" ||
        level === "CRITICAL"
    ) {

        return "Potential Risk Entity";

    }


    if (
        level === "MEDIUM"
    ) {

        return "Monitored Entity";

    }


    if (
        level === "LOW"
    ) {

        return "Low Risk Entity";

    }


    return "Analyzed Account";

}


// =====================================================
// UPDATE RISK BAR
// =====================================================

function updateRiskBar(
    riskLevel
) {

    const bar =
        getElement(
            "entityRiskBar"
        );


    if (!bar) {

        return;

    }


    let width = 20;


    if (
        riskLevel === "MEDIUM"
    ) {

        width = 55;

    }


    if (
        riskLevel === "HIGH"
    ) {

        width = 80;

    }


    if (
        riskLevel === "CRITICAL"
    ) {

        width = 100;

    }


    bar.style.width =
        `${width}%`;

}


// =====================================================
// UPDATE ENTITY INDICATORS
// =====================================================

function updateEntityIndicators(
    risk
) {

    const container =
        getElement(
            "entityIndicators"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (!risk) {

        container.innerHTML = `

            <div class="entity-indicator">

                <span>•</span>

                No risk information available

            </div>

        `;

        return;

    }


    const possibleIndicators = [

        risk.indicators,
        risk.risk_factors,
        risk.flags,
        risk.reasons

    ];


    let indicators = null;


    for (
        const value of
        possibleIndicators
    ) {

        if (
            Array.isArray(value) &&
            value.length > 0
        ) {

            indicators =
                value;

            break;

        }

    }


    if (
        !indicators ||
        indicators.length === 0
    ) {

        const level =
            getRiskLevel(
                risk
            );


        container.innerHTML = `

            <div class="entity-indicator">

                <span>!</span>

                Risk level:
                ${level || "UNKNOWN"}

            </div>

        `;

        return;

    }


    indicators.forEach(
        indicator => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "entity-indicator";


            item.innerHTML = `

                <span>!</span>

                ${indicator}

            `;


            container.appendChild(
                item
            );

        }
    );

}


// =====================================================
// UPDATE CONNECTED ENTITIES
// =====================================================

function updateConnectedEntities(
    account
) {

    const container =
        getElement(
            "connectedEntities"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const accountId =
        account.account_id;


    // -------------------------------------------------
    // Find real transaction connections
    // -------------------------------------------------

    const connected = new Set();


    networkData.edges.forEach(
        edge => {

            if (
                edge.source ===
                accountId
            ) {

                connected.add(
                    edge.target
                );

            }


            if (
                edge.target ===
                accountId
            ) {

                connected.add(
                    edge.source
                );

            }

        }
    );


    const connectedAccounts =
        [...connected];


    if (
        connectedAccounts.length === 0
    ) {

        container.innerHTML = `

            <div class="connected-item">

                No connected entities

            </div>

        `;

        return;

    }


    connectedAccounts.forEach(
        connectedId => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "connected-item";


            item.innerHTML = `

                <span>◉</span>

                ${connectedId}

            `;


            item.addEventListener(
                "click",
                () => {

                    const connectedAccount =
                        accountsData.find(
                            account =>
                                account.account_id ===
                                connectedId
                        );


                    if (
                        connectedAccount
                    ) {

                        openEntityPanel(
                            connectedAccount
                        );

                    }

                }
            );


            container.appendChild(
                item
            );

        }
    );

}


// =====================================================
// DEVICE COUNT
// =====================================================

function getDeviceCount(
    accountId
) {

    let count = 0;


    if (
        !Array.isArray(devicesData)
    ) {

        return count;

    }


    devicesData.forEach(
        device => {

            if (
                Array.isArray(
                    device.accounts
                ) &&
                device.accounts.includes(
                    accountId
                )
            ) {

                count++;

            }

        }
    );


    return count;

}


// =====================================================
// CLOSE ENTITY PANEL
// =====================================================

function closeEntityPanel() {

    const panel =
        getElement(
            "entityPanel"
        );


    const overlay =
        getElement(
            "entityOverlay"
        );


    if (panel) {

        panel.classList.remove(
            "open"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }

}


// =====================================================
// CLOSE BUTTON
// =====================================================

const closePanel =
    getElement(
        "closePanel"
    );


if (closePanel) {

    closePanel.addEventListener(
        "click",
        closeEntityPanel
    );

}


// =====================================================
// OVERLAY CLICK
// =====================================================

const entityOverlay =
    getElement(
        "entityOverlay"
    );


if (entityOverlay) {

    entityOverlay.addEventListener(
        "click",
        closeEntityPanel
    );

}


// =====================================================
// EMPTY NETWORK
// =====================================================

function showEmptyNetwork() {

    const canvas =
        getElement(
            "networkCanvas"
        );


    if (!canvas) {

        return;

    }


    canvas.innerHTML = `

        <div
            style="
                position:absolute;
                inset:0;
                display:flex;
                align-items:center;
                justify-content:center;
                color:#8F8998;
                font-family:'JetBrains Mono',monospace;
                font-size:10px;
                letter-spacing:.1em;
            "
        >

            NO NETWORK DATA AVAILABLE

        </div>

    `;

}


// =====================================================
// BACKEND ERROR
// =====================================================

function showBackendError() {

    if (totalEntities) {

        totalEntities.textContent =
            "--";

    }


    if (totalTransactions) {

        totalTransactions.textContent =
            "--";

    }


    if (flaggedEntities) {

        flaggedEntities.textContent =
            "--";

    }


    if (networkRisk) {

        networkRisk.textContent =
            "OFFLINE";

    }


    if (entityDescription) {

        entityDescription.textContent =
            "Backend connection failed";

    }


    if (transactionDescription) {

        transactionDescription.textContent =
            "Unable to load transaction data";

    }


    if (flaggedDescription) {

        flaggedDescription.textContent =
            "Risk engine unavailable";

    }


    if (networkRiskDescription) {

        networkRiskDescription.textContent =
            "Start Flask backend";

    }


    const canvas =
        getElement(
            "networkCanvas"
        );


    if (canvas) {

        canvas.innerHTML = `

            <div
                style="
                    position:absolute;
                    inset:0;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    flex-direction:column;
                    gap:10px;
                    color:#FF3366;
                    font-family:'JetBrains Mono',monospace;
                    font-size:10px;
                    letter-spacing:.08em;
                "
            >

                <strong>
                    BACKEND OFFLINE
                </strong>

                <span style="color:#8F8998;">
                    Start Flask on port 5000
                </span>

            </div>

        `;

    }

}


// =====================================================
// NETWORK FILTER BUTTONS
// =====================================================

const filterButtons =
    document.querySelectorAll(
        ".small-button"
    );


filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                /*
                    Real filtering will be
                    expanded when we add
                    account/device/person
                    relationship types.
                */

            }
        );

    }
);


// =====================================================
// MONEY FORMATTER
// =====================================================

function formatMoney(
    amount
) {

    return Number(
        amount || 0
    ).toLocaleString(
        "en-IN"
    );

}

// =====================================================
// BOB — ASK ABOUT CURRENT ENTITY
// =====================================================

document.addEventListener(
    "click",
    function (event) {

        const bobButton =
            event.target.closest(
                ".entity-bob-button"
            );

        if (!bobButton) {
            return;
        }

        const accountId =
            window.selectedAccountId;

        if (!accountId) {

            console.warn(
                "TRACE: No entity selected for Bob."
            );

            return;
        }

        console.log(
            "TRACE: Asking Bob about",
            accountId
        );

        const bobPrompt =
    `Investigate account ${accountId} using the TRACE MCP server.

Use the investigate_account tool for ${accountId}.

Return:
1. Network facts
2. Transaction activity
3. Connected accounts
4. Shared devices
5. Network centrality
6. Risk score and risk level
7. Risk indicators

Then provide a concise investigation report based only on the TRACE data.`;

navigator.clipboard.writeText(bobPrompt)
    .then(() => {

        alert(
            `Investigation request for ${accountId} copied!\n\n` +
            `Open Bob chat and paste it.`
        );

    })
    .catch(() => {

        alert(
            `Investigation request created for ${accountId}.\n\n` +
            `Please paste this into Bob:\n\n` +
            bobPrompt
        );

    });

    }
);

// =====================================================
// START TRACE
// =====================================================

loadDashboard();