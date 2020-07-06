## Autoren
- Ahmet Erinola (IHK-GfI)

# Generierung von Lux-Components mithilfe von Angular Schematics

Bereits vorhandene Generatoren

| Name                | Beschreibung                                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| lux-form            | Ermöglicht die Generierung einer Form-Component mit wahlweise einer, zwei bzw. drei Spalten und einer Reihe von Beispiel-FormComponents.                                |
| lux-stepper         | Ermöglicht die Generierung einer Stepper-Component mit übergebener Step-Anzahl, einer Reihe von Beispiel-FormComponents und der Auswahl einer ausgelagerten Navigation. |
| lux-master-detail   | Ermöglicht die Generierung einer Master-Detail-Component mit einer Beispiel-Masterliste und Detail-View.                                                                |
| lux-card            | Ermöglicht die Generierung einer simplen/erweiterbaren Card-Component. Optional ist der zusätzliche Action-Bereich.                                      |
| lux-table           | Ermöglicht die Generierung einer normalen Tabelle gegenüber dem asynchronen Abruf von Daten. Optional kann eine Pagination, Filter oder Multi-Select hinzugefügt werden.|
| lux-accordion       | Ermöglicht die Generierung einer Component mit allein stehendem Panel oder darüber liegendem Accordion.                                                                 |
| lux-tabs            | Ermöglicht die Generierung einer Tabs-Component. Optional können die Tabs um einen Counter und mit weiteren LUX-Components erweitert werden.                            |
| lux-list            | Ermöglicht die Generierung einer List-Component mit/ohne Beispiel-Items.                                                                                                |

## Install

Aktuelle Version installieren:

```bash
npm install lux-components-generate@latest --save-dev
```
Spezielle Version installieren:

```bash
npm install --save lux-components-generate@0.0.1
```

## Ausführen eines Schematic-Scripts

** Als Fachentwickler **

Eine Schematic wird über den folgendeng Aufruf gestartet:

```bash
ng generate lux-components-generator:lux-xyz
```

** Zum lokalen Testen **

Um die Schematics während der Entwicklung auszuführen, muss sie nach Änderungen neu gebaut werden, das erreicht man über den das build-Script von npm:

```bash
npm run build
```

Das Testprojekt, welches die Schematic ausführen soll, mockt den Eintrag als dependency auf das Schematics-Projekt mithilfe von npm link:

```bash
npm link <PFAD-ZUM-LOKALEN-SCHEMATICS-PROJEKT>
```

Das Starten des Schematic-Scripts aus dem Testprojekt erfolgt dann wie gehabt:

```bash
ng generate lux-components-generate:lux-xyz
```

