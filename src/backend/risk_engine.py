import networkx as nx

from data_loader import load_all_data
from network_analyzer import (
    build_transaction_graph,
    calculate_degree,
    calculate_money_received,
    calculate_money_sent,
    calculate_centrality,
    calculate_pagerank,
    find_shared_devices
)


# =====================================================
# RISK THRESHOLDS
# =====================================================

HIGH_DEGREE_THRESHOLD = 4

HIGH_BETWEENNESS_THRESHOLD = 0.25

HIGH_MONEY_FLOW_THRESHOLD = 200000


# =====================================================
# CHECK SHARED DEVICE
# =====================================================

def get_shared_device_accounts(data):

    device_accounts = find_shared_devices(data)

    shared_accounts = set()

    for device, accounts in device_accounts.items():

        if len(accounts) >= 2:

            for account in accounts:

                shared_accounts.add(account)

    return shared_accounts


# =====================================================
# CALCULATE ACCOUNT RISK
# =====================================================

def calculate_account_risk(
    account,
    degree,
    betweenness,
    money_received,
    money_sent,
    shared_accounts
):

    score = 0

    indicators = []


    # -------------------------------------------------
    # 1. HIGH CONNECTIVITY
    # -------------------------------------------------

    account_degree = degree.get(
        account,
        0
    )

    if account_degree >= HIGH_DEGREE_THRESHOLD:

        score += 1

        indicators.append(
            "High network connectivity"
        )


    # -------------------------------------------------
    # 2. HIGH BETWEENNESS
    # -------------------------------------------------

    account_betweenness = betweenness.get(
        account,
        0
    )

    if account_betweenness >= HIGH_BETWEENNESS_THRESHOLD:

        score += 1

        indicators.append(
            "Important position in network paths"
        )


    # -------------------------------------------------
    # 3. HIGH MONEY FLOW
    # -------------------------------------------------

    received = money_received.get(
        account,
        0
    )

    sent = money_sent.get(
        account,
        0
    )

    total_money_flow = received + sent

    if total_money_flow >= HIGH_MONEY_FLOW_THRESHOLD:

        score += 1

        indicators.append(
            "High transaction volume"
        )


    # -------------------------------------------------
    # 4. SHARED DEVICE
    # -------------------------------------------------

    if account in shared_accounts:

        score += 1

        indicators.append(
            "Account shares a device with other accounts"
        )


    # -------------------------------------------------
    # DETERMINE RISK LEVEL
    # -------------------------------------------------

    if score >= 3:

        risk_level = "HIGH"

    elif score == 2:

        risk_level = "MEDIUM"

    elif score == 1:

        risk_level = "LOW"

    else:

        risk_level = "NORMAL"


    return {
        "account": account,
        "risk_score": score,
        "risk_level": risk_level,
        "indicators": indicators
    }


# =====================================================
# ANALYZE ALL ACCOUNTS
# =====================================================

def analyze_accounts(data):

    # Build transaction graph
    graph = build_transaction_graph(data)


    # Network metrics
    degree = calculate_degree(graph)

    (
        degree_centrality,
        betweenness
    ) = calculate_centrality(graph)


    # Money metrics
    money_received = calculate_money_received(data)

    money_sent = calculate_money_sent(data)


    # Shared devices
    shared_accounts = get_shared_device_accounts(
        data
    )


    results = []


    # Analyze every account
    for account in graph.nodes():

        result = calculate_account_risk(
            account,
            degree,
            betweenness,
            money_received,
            money_sent,
            shared_accounts
        )

        results.append(result)


    return results


# =====================================================
# DISPLAY RISK RESULTS
# =====================================================

def display_risk_results(results):

    print("\nTRACE Risk Analysis")
    print("-------------------")


    for result in results:

        print(
            "\n",
            result["account"]
        )

        print(
            "Risk Score:",
            result["risk_score"]
        )

        print(
            "Risk Level:",
            result["risk_level"]
        )


        if result["indicators"]:

            print("Indicators:")

            for indicator in result["indicators"]:

                print(
                    " -",
                    indicator
                )

        else:

            print(
                "Indicators: None"
            )


# =====================================================
# MAIN
# =====================================================

if __name__ == "__main__":

    data = load_all_data()

    results = analyze_accounts(data)

    display_risk_results(results)