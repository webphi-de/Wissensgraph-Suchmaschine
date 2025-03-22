import pandas as pd
import json
import random

# 1. Daten laden (Spaltennamen anpassen!)
data = pd.read_csv("wikidata_results.csv")

# Im Python-Skript (bevor du die JSON generierst):
data["source_id"] = data["language"].str.split("/").str[-1]  # Extrahiert "Q2005" aus der URL
data["target_id"] = data["field"].str.split("/").str[-1]

# 2. Spalten umbenennen (Wikidata-Standard → source/target)
data = data.rename(columns={
    "languageLabel": "source",   # Originalname in Wikidata-CSV
    "fieldLabel": "target"       # Originalname in Wikidata-CSV
})

""" # 3. Nodes extrahieren
nodes = pd.unique(data[["source", "target"]].values.ravel("K")).tolist()
nodes = [{"id": node} for node in nodes]

# 4. Links mit zufälligen Werten (0.5 bis 1.5)
links = data[["source", "target"]].to_dict("records") """
# Nodes mit Wikidata-IDs erstellen
nodes = pd.unique(data[["source", "target"]].values.ravel("K")).tolist()
nodes = [{"id": node} for node in nodes]

# Links mit Wikidata-IDs
links = data[["source", "target","source_id","target_id"]].to_dict("records")
for link in links:
    link["value"] = round(random.uniform(0.5, 1.5), 2)

# 5. Speichern
with open("graph_data.json", "w") as f:
    json.dump({"nodes": nodes, "links": links}, f, indent=2, ensure_ascii=False)