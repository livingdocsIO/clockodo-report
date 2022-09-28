## What this does

The script generates a readable Clockodo .csv report (to save time with billing):
- CSV files containing the accumulated times on differente efforts
- A log output for the meeting times
- log outputs for the "Budgetüberwachung"


## How it works

#### Clockodoo Export

1) Go to Clockodo and select "Baukasten"
2) Select the time period (top left)

<img width="363" alt="image" src="https://user-images.githubusercontent.com/172394/192718381-3440e242-750b-4db8-a667-ee143ed79574.png">

3) Select the customer + project

<img width="610" alt="image" src="https://user-images.githubusercontent.com/172394/192719116-8155b0a8-82b8-479a-8373-63e9b6a1f759.png">

4) Export the selected report as Excel (.csv is currently not supported) (check "Ausgabeformat", "Inhalt der Datei", "Zeitformat")

<img width="756" alt="image" src="https://user-images.githubusercontent.com/172394/192717906-b43f7bf1-fa72-45a4-aed7-f191d6a81644.png">

5) Open the Excel file and save it as "input.csv" into this repository.
6) Run `npm ci && node index.js` to run the script
7) For every project a separate .csv "<desc>, <time-in-hours>", will be created + you get a log "Budgetüberwachung" on the console
