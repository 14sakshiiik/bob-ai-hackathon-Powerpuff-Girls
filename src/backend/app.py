from flask import Flask, jsonify
from flask_cors import CORS

from data_loader import load_all_data
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
from risk_engine import analyze_accounts


# =====================================================
# FLASK APPLICATION
# =====================================================

app = Flask(__name__)
CORS(app)


# =====================================================
# HOME / TEST ROUTE
# =====================================================

@app.route("/")
def home():

    return jsonify({
        "status": "success",
        "message": "TRACE backend is running"
    })


# =====================================================
# ACCOUNT ANALYSIS API
# =====================================================

@app.route("/api/accounts")
def get_accounts():

    data = load_all_data()

    graph = build_transaction_graph(data)

    degree = calculate_degree(graph)

    in_degree = calculate_in_degree(graph)

    out_degree = calculate_out_degree(graph)

    money_received = calculate_money_received(data)

    money_sent = calculate_money_sent(data)

    degree_centrality, betweenness = calculate_centrality(
        graph
    )

    pagerank = calculate_pagerank(graph)

    results = []

    for account in graph.nodes():

        results.append({
            "account_id": account,

            "connections": {
                "total": degree.get(account, 0),
                "incoming": in_degree.get(account, 0),
                "outgoing": out_degree.get(account, 0)
            },

            "money": {
                "received": money_received.get(
                    account,
                    0
                ),
                "sent": money_sent.get(
                    account,
                    0
                )
            },

            "centrality": {
                "degree": round(
                    degree_centrality.get(
                        account,
                        0
                    ),
                    4
                ),

                "betweenness": round(
                    betweenness.get(
                        account,
                        0
                    ),
                    4
                )
            },

            "pagerank": round(
                pagerank.get(
                    account,
                    0
                ),
                4
            )
        })

    return jsonify(results)

# =====================================================
# NETWORK GRAPH API
# =====================================================

@app.route("/api/network")
def get_network():

    data = load_all_data()

    graph = build_transaction_graph(data)

    # ---------------------------------------------
    # NODES
    # ---------------------------------------------

    nodes = []

    for node in graph.nodes():

        nodes.append({
            "id": str(node),
            "type": "account"
        })


    # ---------------------------------------------
    # EDGES
    # ---------------------------------------------

    edges = []

    for source, target, attributes in graph.edges(
        data=True
    ):

        edge = {
            "source": str(source),
            "target": str(target)
        }


        # Keep any useful edge information
        # already stored by the graph.

        for key, value in attributes.items():

            try:

                # Convert numeric values into
                # JSON-friendly numbers.

                if isinstance(
                    value,
                    (int, float)
                ):

                    edge[key] = value

                else:

                    edge[key] = str(value)

            except Exception:

                pass


        edges.append(edge)


    return jsonify({

        "nodes": nodes,

        "edges": edges,

        "node_count": len(nodes),

        "edge_count": len(edges)

    })

# =====================================================
# RISK ANALYSIS API
# =====================================================

@app.route("/api/risk")
def get_risk():

    data = load_all_data()

    results = analyze_accounts(data)

    return jsonify(results)


# =====================================================
# SHARED DEVICE API
# =====================================================

@app.route("/api/devices")
def get_shared_devices():

    data = load_all_data()

    device_accounts = find_shared_devices(data)

    results = []

    for device, accounts in device_accounts.items():

        results.append({
            "device_id": device,
            "accounts": accounts,
            "account_count": len(accounts)
        })

    return jsonify(results)


# =====================================================
# RAW DATA SUMMARY
# =====================================================

@app.route("/api/summary")
def get_summary():

    data = load_all_data()

    return jsonify({

        "accounts": len(
            data["accounts"]
        ),

        "persons": len(
            data["persons"]
        ),

        "devices": len(
            data["devices"]
        ),

        "transactions": len(
            data["transactions"]
        ),

        "account_devices": len(
            data["account_devices"]
        ),

        "calls": len(
            data["call_logs"]
        )
    })


# =====================================================
# START SERVER
# =====================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )