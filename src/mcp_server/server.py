import sys
import os
import json

from mcp.server.mcpserver import MCPServer


# =====================================================
# ALLOW MCP SERVER TO ACCESS TRACE BACKEND FILES
# =====================================================

TRACE_ROOT = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

BACKEND_PATH = os.path.join(
    TRACE_ROOT,
    "backend"
)

if BACKEND_PATH not in sys.path:
    sys.path.insert(0, BACKEND_PATH)

# =====================================================
# TRACE IMPORTS
# =====================================================

from data_loader import load_all_data
from risk_engine import analyze_accounts

from network_analyzer import (
    build_transaction_graph,
    calculate_degree,
    calculate_in_degree,
    calculate_out_degree,
    calculate_money_received,
    calculate_money_sent,
    calculate_centrality,
    calculate_pagerank,
    find_shared_devices
)


# =====================================================
# MCP SERVER
# =====================================================

mcp = MCPServer("TRACE Network Analyzer")


# =====================================================
# TOOL 1 ÔÇö NETWORK SUMMARY
# =====================================================

@mcp.tool()
def get_network_summary() -> str:
    """
    Returns a summary of the TRACE investigation network.
    """

    data = load_all_data()

    return json.dumps({
        "accounts": len(data["accounts"]),
        "transactions": len(data["transactions"]),
        "devices": len(data["devices"]),
        "persons": len(data["persons"]),
        "call_logs": len(data["call_logs"]),
        "account_devices": len(data["account_devices"])
    }, indent=2)


# =====================================================
# TOOL 2 ÔÇö ACCOUNT DETAILS
# =====================================================

@mcp.tool()
def get_account_details(account_id: str) -> str:
    """
    Returns investigation data for a specific TRACE account.
    """

    data = load_all_data()

    graph = build_transaction_graph(data)

    # -------------------------------------------------
    # Check whether account exists
    # -------------------------------------------------

    if account_id not in graph.nodes():

        return json.dumps({
            "error": f"Account {account_id} was not found in the TRACE network."
        }, indent=2)


    # -------------------------------------------------
    # Calculate existing TRACE metrics
    # -------------------------------------------------

    degree = calculate_degree(graph)

    in_degree = calculate_in_degree(graph)

    out_degree = calculate_out_degree(graph)

    money_received = calculate_money_received(data)

    money_sent = calculate_money_sent(data)

    degree_centrality, betweenness = calculate_centrality(
        graph
    )

    pagerank = calculate_pagerank(graph)


    # -------------------------------------------------
    # Connected accounts
    # -------------------------------------------------

    connected_accounts = list(
        graph.neighbors(account_id)
    )


    # -------------------------------------------------
    # Shared devices
    # -------------------------------------------------

    device_accounts = find_shared_devices(data)

    shared_devices = []

    for device, accounts in device_accounts.items():

        if account_id in accounts:
            shared_devices.append(device)


    # -------------------------------------------------
    # Build result
    # -------------------------------------------------

    result = {

        "account_id": account_id,

        "connections": {
            "total": degree.get(account_id, 0),
            "incoming": in_degree.get(account_id, 0),
            "outgoing": out_degree.get(account_id, 0)
        },

        "money": {
            "received": money_received.get(
                account_id,
                0
            ),

            "sent": money_sent.get(
                account_id,
                0
            )
        },

        "centrality": {
            "degree": round(
                degree_centrality.get(
                    account_id,
                    0
                ),
                4
            ),

            "betweenness": round(
                betweenness.get(
                    account_id,
                    0
                ),
                4
            )
        },

        "pagerank": round(
            pagerank.get(
                account_id,
                0
            ),
            4
        ),

        "connected_accounts": connected_accounts,

        "shared_devices": shared_devices
    }


    return json.dumps(
        result,
        indent=2
    )


# =====================================================
# TOOL 3 ÔÇö ACCOUNT RISK
# =====================================================

@mcp.tool()
def get_account_risk(account_id: str) -> str:
    """
    Returns the TRACE risk assessment for a specific account.
    """

    data = load_all_data()

    risk_results = analyze_accounts(data)

    for result in risk_results:

        if result["account"] == account_id:

            return json.dumps(
                result,
                indent=2
            )

    return json.dumps({
        "error": f"No risk assessment found for account {account_id}."
    }, indent=2)


# =====================================================
# TOOL 4 ÔÇö COMPLETE ACCOUNT INVESTIGATION
# =====================================================

@mcp.tool()
def investigate_account(account_id: str) -> str:
    """
    Returns the complete TRACE investigation data
    for a specific account, including network metrics
    and risk-engine results.
    """

    data = load_all_data()

    graph = build_transaction_graph(data)

    # -------------------------------------------------
    # Check account
    # -------------------------------------------------

    if account_id not in graph.nodes():

        return json.dumps({
            "error": f"Account {account_id} was not found in the TRACE network."
        }, indent=2)


    # -------------------------------------------------
    # Network metrics
    # -------------------------------------------------

    degree = calculate_degree(graph)

    in_degree = calculate_in_degree(graph)

    out_degree = calculate_out_degree(graph)

    money_received = calculate_money_received(data)

    money_sent = calculate_money_sent(data)

    degree_centrality, betweenness = calculate_centrality(
        graph
    )

    pagerank = calculate_pagerank(graph)


    # -------------------------------------------------
    # Connected accounts
    # -------------------------------------------------

    connected_accounts = list(
        graph.neighbors(account_id)
    )


    # -------------------------------------------------
    # Shared devices
    # -------------------------------------------------

    device_accounts = find_shared_devices(data)

    shared_devices = []

    for device, accounts in device_accounts.items():

        if account_id in accounts:
            shared_devices.append(device)


    # -------------------------------------------------
    # Risk engine
    # -------------------------------------------------

    risk_results = analyze_accounts(data)

    risk_result = None

    for result in risk_results:

        if result["account"] == account_id:

            risk_result = result
            break


    # -------------------------------------------------
    # Complete investigation
    # -------------------------------------------------

    result = {

        "account_id": account_id,

        "network_facts": {

            "connections": {
                "total": degree.get(
                    account_id,
                    0
                ),

                "incoming": in_degree.get(
                    account_id,
                    0
                ),

                "outgoing": out_degree.get(
                    account_id,
                    0
                )
            },

            "money": {

                "received": money_received.get(
                    account_id,
                    0
                ),

                "sent": money_sent.get(
                    account_id,
                    0
                )
            },

            "centrality": {

                "degree": round(
                    degree_centrality.get(
                        account_id,
                        0
                    ),
                    4
                ),

                "betweenness": round(
                    betweenness.get(
                        account_id,
                        0
                    ),
                    4
                )
            },

            "pagerank": round(
                pagerank.get(
                    account_id,
                    0
                ),
                4
            ),

            "connected_accounts": connected_accounts,

            "shared_devices": shared_devices
        },

        "risk_assessment": risk_result
    }


    return json.dumps(
        result,
        indent=2
    )

# =====================================================
# START MCP SERVER
# =====================================================

if __name__ == "__main__":

    mcp.run()
