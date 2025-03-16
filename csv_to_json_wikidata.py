import pandas as pd
import json

# Daten laden
data = pd.read_csv("wikidata_results.csv")

# 1. Spalten umbenennen (languageLabel → source, fieldLabel → target)
data = data.rename(columns={
    "languageLabel": "source",
    "fieldLabel": "target"
})

# 2. Eindeutige Nodes aus beiden Spalten extrahieren
all_nodes = pd.concat([data["source"], data["target"]]).unique()
nodes = [{"id": node} for node in all_nodes]

# 3. Links formatieren
links = data[["source", "target"]].to_dict("records")
for link in links:
    link["value"] = 1  # Beispielwert (später durch echte Gewichtung ersetzen)

# 4. JSON für D3.js erstellen
graph_data = {
    "nodes": nodes,
    "links": links
}

# Speichern
with open("graph_data.json", "w") as f:
    json.dump(graph_data, f, ensure_ascii=False, indent=2)