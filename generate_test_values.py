import pandas as pd
import json
import random

# 1. Daten laden (Spaltennamen anpassen!)
data = pd.read_csv("wikidata_results.csv")

# 2. Spalten umbenennen (Wikidata-Standard → source/target)
data = data.rename(columns={
    "languageLabel": "source",   # Originalname in Wikidata-CSV
    "fieldLabel": "target"       # Originalname in Wikidata-CSV
})

# 3. Nodes extrahieren
nodes = pd.unique(data[["source", "target"]].values.ravel("K")).tolist()
nodes = [{"id": node} for node in nodes]

# 4. Links mit zufälligen Werten (0.5 bis 1.5)
links = data[["source", "target"]].to_dict("records")
for link in links:
    link["value"] = round(random.uniform(0.5, 1.5), 2)

# 5. Speichern
with open("graph_data.json", "w") as f:
    json.dump({"nodes": nodes, "links": links}, f, indent=2, ensure_ascii=False)