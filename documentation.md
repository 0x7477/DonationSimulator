# Dokumentation

## Problemstellung

Es soll ein Spende-Modell erstellt werden um verschiedene Methoden zur Donation-Incentivization (DI) testen zu können.

## Wie beginnt man so ein Projekt?

Zunächst stellt man sich folgende Fragen:

### Für wen ist das Projekt gedacht?
Das Projekt ist für Leute gedacht, die die verschiedenen Methoden zur Donation-Incentivization (DI) noch nicht kennen oder solche System implementieren wollen und parametrisieren müssen.

### Wie viele Ressourcen stehen zur Verfügung?
10-20 Stunden

### Wie sieht das grobe Konzept aus?
Ein Nutzer bekommt die Möglichkeit Parameter
einzustellen und erhält eine Übersicht wie sich
diese Parameter auf das Spendeverhalten auswirken würden. Dazu wird eine deutsche Person simuliert und das Spendeverhalten aufgrund mehrerer Daten wie z.B. (Reichtum, Popularität, soziales Engagement) berechnet. Anschließend wird dem Nutzer gezeigt wie viel Geld bei welchen Charities landet.

### Kritik am Konzept

Natürlich kann keine genaue Simulation erfolgen, aber zumindest die Auswirkung verschiedner Parameter sollten sichtbar werden. Das Szenario ist, dass ein Donation-System bei welchem mehrere Charities mitmachen auf einen Konkurrenzlosen Markt geschmissen werden. Es ist natürlich komplett klar, das verschiedene Menschen verschiedene Präferenzen in ihrem Spendeverhalten besitzen. Mit der Methode wird der generelle Erfolg für die Durchschnittsbevölkerung versucht zu simulieren. In gewissen Teilen der Gesellschaft haben verschiedene Konzeote mit Sicherheit unterschiedlich guten Erfolg. Es ist durchaus Möglich, dass ein System, welches in der Simulation schlecht abschneidet in der Realität bei einer gewissen Zielgruppe sehr erfolgreich wäre oder ein System, dass in der Simulation gut abschneidet in Konkurrenz zu bereits bestehenden Systemen schlechter abschneidet und damit wenig Potential bieten würde.

### Welche Technologie verwende ich?
In diesem Fall Svelte/Javascript, weil so von Ihnen gewünscht :D

## Bearbeitungsbeginn

Zunächst musste ich mich mit den verschiedenen Methoden zur DI vertraut machen.

Folgende Methoden habe ich mir angesehen:

- Quadratic Funding (Funding Demokratisieren)
- Downline Distribution (Leute einladen, die Geld an Einladende geben)
- Gift-Giving (z.B. Tshirts oder emotionale Geschenke (z.B. Briefe) geben )

Aus Zeitgründen will ich mich ausschließlich mit diesen Beschäftigen.

## Modelle

Um das Modell aufbauen zu können brauchen wir Axiome und Daten. Zum Beispiel hätten wir ein Axiom: "Verschuldete Menschen spenden nicht". Dies ist etwas, was sich nicht unbedingt leicht beweisen lässt, aber im Rahmen der Simulation umgesetzt werden soll. Dieses Axiom mit dem Anteil der Verschuldeten Personen zusammen gibt uns eine qualifizierte Aussage, die wir zur Simulation benutzen können.

Für das Projekt wurden verschiedene Quellen benutzt. Aus diesen Daten werden dann anschließend Modelle aufgebaut:

### Die Vermögensverteilung
Zur Bestimmung wie viel Geld eine zu simulierende Person hat
### Das Donation Modell
Ob diese Person überhaupt Geld spendet
### Das Donation Share Modell
Wie viel von dem Geld wird auch gespendet

### Das Popularitätsmodell
Hier wird die Popularität der Menschen geschätzt.

Dazu habe ich folgende Angaben gefunden:

|Follower|Prozent die <= Follower haben
|-|-|
|0|	0,5|
|500|	0,77|
|999|	0,9|
|1000|	0,87|
|3999|	0,96|
|5000|	0,97|
|9999|	0,99|

Ein Modell dafür wurde mit GeoGebra erstellt:
![img](img/follower.png)

### Die Riskoverteilung
Es gibt keine wirkliche Metrik für Risko, daher benutzen wir eine einfach Standardverteilung.

Risikobereitschaft soll ausdrücken wie sehr ein Mensch dau geneigt ist Geld zu spenden, wenn 
er keine volle Kontrolle darüber hat, wo das Geld landet. Dies schließt die Downline-Distribution, aber auch das
