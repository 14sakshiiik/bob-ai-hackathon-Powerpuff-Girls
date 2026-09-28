import networkx as nx

from data_loader import load_all_data


# =====================================================
# BUILD TRANSACTION GRAPH
# =====================================================

def build_transaction_graph(data):

    graph = nx.DiGraph()

    transactions = data["transactions"]

    for transaction in transactions:

        sender = transaction["from_account"]
        receiver = transaction["to_account"]

        amount = transaction["amount"]

        # Add accounts as nodes
        graph.add_node(sender)
        graph.add_node(receiver)

        # Add transaction as a directed edge
        graph.add_edge(
            sender,
            receiver,
            amount=amount,
            transaction_id=transaction["transaction_id"],
            timestamp=transaction["timestamp"]
        )

    return graph


# =====================================================
# CALCULATE DEGREE
# =====================================================

def calculate_degree(graph):

    return dict(graph.degree())


# =====================================================
# CALCULATE IN-DEGREE
# =====================================================

def calculate_in_degree(graph):

    return dict(graph.in_degree())


# =====================================================
# CALCULATE OUT-DEGREE
# =====================================================

def calculate_out_degree(graph):

    return dict(graph.out_degree())


# =====================================================
# CALCULATE MONEY RECEIVED
# =====================================================

def calculate_money_received(data):

    received = {}

    for transaction in data["transactions"]:

        receiver = transaction["to_account"]
        amount = transaction["amount"]

        if receiver not in received:
            received[receiver] = 0

        received[receiver] += amount

    return received


# =====================================================
# CALCULATE MONEY SENT
# =====================================================

def calculate_money_sent(data):

    sent = {}

    for transaction in data["transactions"]:

        sender = transaction["from_account"]
        amount = transaction["amount"]

        if sender not in sent:
            sent[sender] = 0

        sent[sender] += amount

    return sent


# =====================================================
# CALCULATE CENTRALITY
# =====================================================

def calculate_centrality(graph):

    degree_centrality = nx.degree_centrality(graph)

    betweenness_centrality = nx.betweenness_centrality(
        graph
    )

    return (
        degree_centrality,
        betweenness_centrality
    )


# =====================================================
# CALCULATE PAGERANK
# =====================================================

def calculate_pagerank(graph):

    return nx.pagerank(graph)


# =====================================================
# FIND SHARED DEVICES
# =====================================================

def find_shared_devices(data):

    device_accounts = {}

    for relationship in data["account_devices"]:

        account = relationship["account_id"]
        device = relationship["device_id"]

        if device not in device_accounts:

            device_accounts[device] = []

        device_accounts[device].append(account)

    return device_accounts


# =====================================================
# FIND ACCOUNTS USING SHARED DEVICES
# =====================================================

def find_shared_device_connections(data):

    device_accounts = find_shared_devices(data)

    shared_connections = {}

    for device, accounts in device_accounts.items():

        # A device must be connected to at least
        # two accounts to be considered shared.

        if len(accounts) < 2:
            continue

        for account in accounts:

            if account not in shared_connections:
                shared_connections[account] = []

            for other_account in accounts:

                if other_account != account:

                    shared_connections[account].append(
                        other_account
                    )

    return shared_connections


# =====================================================
# MAIN
# =====================================================

if __name__ == "__main__":

    # -------------------------------------------------
    # LOAD DATA
    # -------------------------------------------------

    data = load_all_data()


    # -------------------------------------------------
    # BUILD TRANSACTION GRAPH
    # -------------------------------------------------

    graph = build_transaction_graph(data)


    # -------------------------------------------------
    # BASIC GRAPH INFORMATION
    # -------------------------------------------------

    print("TRACE Network Analyzer")
    print("----------------------")

    print(
        "Nodes:",
        graph.number_of_nodes()
    )

    print(
        "Edges:",
        graph.number_of_edges()
    )


    # -------------------------------------------------
    # CONNECTION ANALYSIS
    # -------------------------------------------------

    degree = calculate_degree(graph)

    in_degree = calculate_in_degree(graph)

    out_degree = calculate_out_degree(graph)


    print("\nConnection Analysis")
    print("-------------------")

    for account in graph.nodes():

        print(
            account,
            "| Total:",
            degree.get(account, 0),
            "| Incoming:",
            in_degree.get(account, 0),
            "| Outgoing:",
            out_degree.get(account, 0)
        )


    # -------------------------------------------------
    # MONEY FLOW ANALYSIS
    # -------------------------------------------------

    money_received = calculate_money_received(data)

    money_sent = calculate_money_sent(data)


    print("\nMoney Flow Analysis")
    print("-------------------")

    for account in graph.nodes():

        received = money_received.get(
            account,
            0
        )

        sent = money_sent.get(
            account,
            0
        )

        print(
            account,
            "| Received: ₹",
            received,
            "| Sent: ₹",
            sent
        )


    # -------------------------------------------------
    # CENTRALITY ANALYSIS
    # -------------------------------------------------

    (
        degree_centrality,
        betweenness_centrality
    ) = calculate_centrality(graph)


    print("\nCentrality Analysis")
    print("-------------------")

    for account in graph.nodes():

        print(
            account,
            "| Degree Centrality:",
            round(
                degree_centrality[account],
                3
            ),
            "| Betweenness:",
            round(
                betweenness_centrality[account],
                3
            )
        )


    # -------------------------------------------------
    # PAGERANK
    # -------------------------------------------------

    pagerank = calculate_pagerank(graph)


    print("\nPageRank")
    print("--------")

    for account, score in pagerank.items():

        print(
            account,
            "->",
            round(score, 4)
        )


    # -------------------------------------------------
    # SHARED DEVICE ANALYSIS
    # -------------------------------------------------

    print("\nShared Device Analysis")
    print("----------------------")

    device_accounts = find_shared_devices(data)


    for device, accounts in device_accounts.items():

        if len(accounts) >= 2:

            print(
                device,
                "->",
                ", ".join(accounts)
            )


    # -------------------------------------------------
    # SHARED DEVICE CONNECTIONS
    # -------------------------------------------------

    print("\nShared Device Connections")
    print("------------------------")

    shared_connections = find_shared_device_connections(
        data
    )


    for account, connections in shared_connections.items():

        print(
            account,
            "->",
            ", ".join(connections)
        )