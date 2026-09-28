import json
from pathlib import Path


# Location of our data folder
DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def load_json(filename):
    """
    Load a JSON file from the data folder.
    """

    file_path = DATA_DIR / filename

    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def load_all_data():

    persons = load_json("persons.json")
    accounts = load_json("accounts.json")
    transactions = load_json("transactions.json")
    devices = load_json("devices.json")
    call_logs = load_json("call_logs.json")
    account_devices = load_json("account_devices.json")

    return {
        "persons": persons,
        "accounts": accounts,
        "transactions": transactions,
        "devices": devices,
        "call_logs": call_logs,
        "account_devices": account_devices
    }


if __name__ == "__main__":

    data = load_all_data()

    print("TRACE Data Loader")
    print("-----------------")

    print("Persons:", len(data["persons"]))
    print("Accounts:", len(data["accounts"]))
    print("Transactions:", len(data["transactions"]))
    print("Devices:", len(data["devices"]))
    print("Call logs:", len(data["call_logs"]))
    print("Account-device links:", len(data["account_devices"]))