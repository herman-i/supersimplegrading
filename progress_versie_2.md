# Voortgang Versie 2 - 26 januari 2026

De webpagina is bijgewerkt naar aanleiding van de specificaties in `versie_2.md`. Hieronder volgt een overzicht van de gerealiseerde verbeteringen.

## Gerealiseerde Functionaliteiten

### 1. Categorisering en Layout
De te kiezen termen zijn verdeeld over drie visueel onderscheidbare categorieën met eigen achtergrondkleuren:
- **Supraventriculair**: Lichtgroene achtergrond (`#e8f5e9`).
- **Ventriculair**: Lichtgele achtergrond (`#fffde7`).
- **Advies**: Lichtblauwe achtergrond (`#e3f2fd`).

### 2. Dynamische Selectielogica (Triggers)
Bepaalde keuzes activeren automatisch andere selecties om de workflow te versnellen en consistentie te waarborgen:

*   **Supraventriculair**:
    *   *Atriumfibrilleren of -flutter*: Activeert Graad 3 en "Stroken meesturen".
    *   *Geen ritme- of geleidingsstoornissen*: Activeert Graad 1.
    *   *Mobitz 2 AV block*: Activeert Graad 3 en "Stroken meesturen".
*   **Ventriculair**:
    *   *Frequente VES (burden boven norm)*: Activeert Graad 3 en "Stroken meesturen".
    *   *Tripletten (lang koppelingsinterval)*: Activeert Graad 2 en "Stroken meesturen".
    *   *VT (sustained/non-sustained)*: Activeert Graad 3 en "Stroken meesturen".
*   **Advies**:
    *   *Lifestyle advies (caffeïne/stress)*: Activeert Graad 1.
    *   *Graad 2*: Activeert "Stroken meesturen".
    *   *Graad 3*: Activeert "Stroken meesturen".

### 3. Inhoudelijke Updates
De lijst met termen is uitgebreid met onder andere:
- Eerstegraads AV block.
- Tweedegraads AV block (Wenckebach en Mobitz 2).
- Specifieke ventriculaire ritmestoornissen met bijbehorende advies-triggers.

## Technische Details
- **`script_new.js`**: Gebruikt nu een gestructureerd JSON-object (`data`) voor de termen, inclusief `triggers` en `id` velden voor de logica. De rendering gebeurt dynamisch in containers (`category-section`).
- **`style.css`**: Bevat de klassen voor de gekleurde secties en verbeterde styling voor de checkbox-containers en headers.
- **`index.html`**: Koppelt de nieuwe logica en styling aan de pagina.

## Status
De pagina voldoet aan de huidige eisen van `versie_2.md` inclusief de kleurstellingen en de automatische vink-logica.
