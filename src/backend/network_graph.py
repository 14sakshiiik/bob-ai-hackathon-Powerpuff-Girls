import networkx as nx

from data_loader import load_all_data


# =====================================================
# BUILD MULTI-LAYER NETWORK
# =====================================================

def build_network(data):

    graph = nx.MultiDiGraph()


    # =================================================
    # 1. ADD ACCOUNT NODES
    # =================================================

    for account in data["accounts"]:

        account_id = account["account_id"]

        graph.add_node(
            account_id,
            node_type="account"
        )


    # =================================================
    # 2. ADD PERSON NODES
    # =================================================

    for person in data["persons"]:

        person_id = person["person_id"]

        graph.add_node(
            person_id,
            node_type="person"
        )


    # =================================================
    # 3. ADD DEVICE NODES
    # =================================================

    for device in data["devices"]:

        device_id = device["device_id"]

        graph.add_node(
            device_id,
            node_type="device"
        )


    # =================================================
    # 4. ADD PERSON → ACCOUNT OWNERSHIP
    # =================================================

    for account in data["accounts"]:

        account_id = account["account_id"]
        person_id = account["person_id"]

        graph.add_edge(
            person_id,
            account_id,
            relationship="owns"
        )


    # =================================================
    # 5. ADD ACCOUNT → ACCOUNT TRANSACTIONS
    # =================================================

    for transaction in data["transactions"]:

        sender = transaction["from_account"]
        receiver = transaction["to_account"]

        graph.add_edge(
            sender,
            receiver,
            relationship="transaction",
            amount=transaction["amount"],
            transaction_id=transaction["transaction_id"],
            timestamp=transaction["timestamp"]
        )


    # =================================================
    # 6. ADD ACCOUNT → DEVICE RELATIONSHIPS
    # =================================================

    for relationship in data["account_devices"]:

        account = relationship["account_id"]
        device = relationship["device_id"]

        graph.add_edge(
            account,
            device,
            relationship="uses_device"
        )


    # =================================================
    # 7. CREATE PHONE → PERSON LOOKUP
    # =================================================

    phone_to_person = {}

    for person in data["persons"]:

        phone = str(person["phone"])
        person_id = person["person_id"]

        phone_to_person[phone] = person_id


    # =================================================
    # 8. ADD PERSON → PERSON CALL RELATIONSHIPS
    # =================================================

    for call in data["call_logs"]:

        from_phone = str(call["from_phone"])
        to_phone = str(call["to_phone"])

        caller = phone_to_person.get(from_phone)
        receiver = phone_to_person.get(to_phone)

        # Only add the call if both phone numbers
        # belong to known persons.

        if caller and receiver:

            graph.add_edge(
                caller,
                receiver,
                relationship="call",
                call_id=call["call_id"],
                duration_seconds=call["duration_seconds"],
                timestamp=call["timestamp"]
            )


    return graph


# =====================================================
# DISPLAY NETWORK SUMMARY
# =====================================================

def display_network_summary(graph):

    print("TRACE Multi-Layer Network")
    print("------------------------")

    print(
        "Total Nodes:",
        graph.number_of_nodes()
    )

    print(
        "Total Relationships:",
        graph.number_of_edges()
    )


# =====================================================
# DISPLAY NODE TYPES
# =====================================================

def display_node_types(graph):

    print("\nNode Types")
    print("----------")

    for node, attributes in graph.nodes(data=True):

        print(
            node,
            "->",
            attributes["node_type"]
        )


# =====================================================
# DISPLAY RELATIONSHIPS
# =====================================================

def display_relationships(graph):

    print("\nRelationships")
    print("-------------")

    for source, target, attributes in graph.edges(data=True):

        relationship = attributes["relationship"]

        print(
            source,
            "--",
            relationship,
            "-->",
            target
        )


# =====================================================
# MAIN
# =====================================================

if __name__ == "__main__":

    # Load JSON data
    data = load_all_data()

    # Build multi-layer network
    graph = build_network(data)

    # Display network information
    display_network_summary(graph)

    display_node_types(graph)

    display_relationships(graph)