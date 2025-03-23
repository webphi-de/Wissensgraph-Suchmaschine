import pandas as pd
import json
import random

# Daten laden
data = pd.read_csv("wikidata_results.csv")

# Nodes erstellen (mit id und name)
nodes = []
seen_ids = set()

for _, row in data.iterrows():
    # Source-Knoten
    source_id = row["language"].split("/")[-1]  # Q2005
    source_name = row["languageLabel"]          # JavaScript
    if source_id not in seen_ids:
        nodes.append({ "id": source_id, "name": source_name })
        seen_ids.add(source_id)
    
    # Target-Knoten
    target_id = row["field"].split("/")[-1]     # Q80006
    target_name = row["fieldLabel"]             # Programmierung
    if target_id not in seen_ids:
        nodes.append({ "id": target_id, "name": target_name })
        seen_ids.add(target_id)

# Links erstellen (verweisen auf ids)
links = [
    { "source": row["language"].split("/")[-1], 
      "target": row["field"].split("/")[-1], 
      "value": round(random.uniform(0.5, 1.5), 2) }
    for _, row in data.iterrows()
]

# Speichern
with open("graph_data.json", "w") as f:
    json.dump({ "nodes": nodes, "links": links }, f, indent=2, ensure_ascii=False)