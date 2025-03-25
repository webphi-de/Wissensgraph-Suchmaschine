# Korrektur: "import" statt "mport"
import pandas as pd
import json
import random
from uuid import uuid4  # Für eindeutige IDs falls nötig

# (1) Effizienter mit itertuples()
data = pd.read_csv("wikidata_results.csv")
seen_ids = set()
nodes = []
links = []

# (2) Nodes/Links mit Schleife kombinieren
for row in data.itertuples():
    # Source-Knoten
    source_id = row.language.split("/")[-1]
    source_name = row.languageLabel
    if source_id not in seen_ids:
        nodes.append({"id": source_id, "name": source_name})
        seen_ids.add(source_id)
    
    # Target-Knoten
    target_id = row.field.split("/")[-1]
    target_name = row.fieldLabel
    if target_id not in seen_ids:
        nodes.append({"id": target_id, "name": target_name})
        seen_ids.add(target_id)
    
    # Link (evtl. "value" durch echte Metrik ersetzen)
    links.append({
        "source": source_id,
        "target": target_id,
        "value": round(random.uniform(0.5, 1.5), 2)
    })

# (3) Mit UUID für stabile Referenzen (optional)
# nodes = [{"id": str(uuid4()), "name": n["name"], "qid": n["id"]} for n in nodes]

# Speichern
with open("graph_data.json", "w") as f:
    json.dump({"nodes": nodes, "links": links}, f, indent=2, ensure_ascii=False)