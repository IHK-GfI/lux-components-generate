## Autoren

- Ahmet Erinola (IHK-GfI)
- Thomas Dickhut (IHK-GfI)

# Generierung von LUX-Components mithilfe von Angular Schematics

| Name              | Beschreibung                                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| lux-form          | Ermöglicht die Generierung einer Form-Component mit wahlweise einer, zwei bzw. drei Spalten und einer Reihe von Beispiel-FormComponents.                                 |
| lux-stepper       | Ermöglicht die Generierung einer Stepper-Component mit übergebener Step-Anzahl, einer Reihe von Beispiel-FormComponents und der Auswahl einer ausgelagerten Navigation.  |
| lux-master-detail | Ermöglicht die Generierung einer Master-Detail-Component mit einer Beispiel-Masterliste und Detail-View.                                                                 |
| lux-card          | Ermöglicht die Generierung einer simplen/erweiterbaren Card-Component. Optional ist der zusätzliche Action-Bereich.                                                      |
| lux-table         | Ermöglicht die Generierung einer normalen Tabelle gegenüber dem asynchronen Abruf von Daten. Optional kann eine Pagination, Filter oder Multi-Select hinzugefügt werden. |
| lux-accordion     | Ermöglicht die Generierung einer Component mit allein stehendem Panel oder darüber liegendem Accordion.                                                                  |
| lux-tabs          | Ermöglicht die Generierung einer Tabs-Component. Optional können die Tabs um einen Counter und mit weiteren LUX-Components erweitert werden.                             |
| lux-list          | Ermöglicht die Generierung einer List-Component mit/ohne Beispiel-Items.                                                                                                 |

## Install

Aktuelle Version installieren:

```bash
npm install @ihk-gfi/lux-components-generate@latest --save-dev
```

Spezielle Version installieren:

```bash
npm install --save @ihk-gfi/lux-components-generate@15
```

## Ausführen eines Schematic-Scripts

**Als Entwickler**

Ein Schematic aufrufen:

```bash
ng generate @ihk-gfi/lux-components-generate:lux-xyz
```

**Lokaler Test**

Um die Schematics während der Entwicklung auszuführen, müssen diese nach Änderungen neu gebaut werden.
Für diesen Zweck kann das folgende `npm`-Script aus der `package.json` verwendet werden:

```bash
npm run build
```

Das Testprojekt, welches die Schematics ausführen soll, verlinkt das Schematics-Projekt.
Für diesen Zweck kann der folgende `npm`-Befehl in der Console verwendet werden:

```bash
npm link <PFAD-ZUM-LOKALEN-SCHEMATICS-PROJEKT>
```

Das Starten der Schematic-Scripte bleibt unverändert:

```bash
ng generate @ihk-gfi/lux-components-generate:lux-xyz
```
