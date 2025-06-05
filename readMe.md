
# IMS API

Ett TypeScript-baserat RESTful API med Express och Mongoose för att hantera ett produktlager, inklusive tillverkare och kontaktinformation.

## Funktioner

- CRUD-operationer för produkter
- Avancerad sökning och filtrering (namn, kategori, tillverkare, prisintervall, lagerstatus)
- Validering och felhantering med Mongoose
- Modulära TypeScript-typer och begäranvalidering

## Projektstruktur

```
src/
├── product/
│   ├── product.controller.ts  # Hanterare för produktvägar
│   ├── product.model.ts       # Mongoose-schema & modell
│   └── product.types.ts       # TypeScript-gränssnitt & typer
├── index.ts                   # Startpunkt
```

## Kom igång

### 1. Installera beroenden

```bash
npm install
```

### 2. Skapa `.env`-fil

```env
PORT=3000
MONGODB_URI=mongodb+srv://<användarnamn>:<lösenord>@<kluster>.mongodb.net/<databas>?retryWrites=true&w=majority
```

### 3. Starta utvecklingsservern

```bash
npm run dev
```

### Produkter

| Metod | URL | Beskrivning |
|-------|-----|-------------|
| GET | `/products` | Hämta alla produkter |
| GET | `/products/:id` | Hämta en specifik produkt |
| POST | `/products` | Skapa en ny produkt |
| PUT | `/products/:id` | Uppdatera en produkt |
| DELETE | `/products/:id` | Ta bort en produkt |
| GET | `/products/category/:category` | Produkter per kategori |
| GET | `/products/manufacturer/:manufacturer` | Produkter per tillverkare |
| GET | `/products/search` | Sök med filter (query-parametrar: name, category, manufacturer, minPrice, maxPrice, inStock) |

## Teknologier

- Node.js + Express
- TypeScript
- Mongoose (MongoDB)
- TSX (för hot-reloading)
- Dotenv

## Tips för utveckling

- Använd [Thunder Client](https://www.thunderclient.com/) eller [Postman](https://www.postman.com/) för att testa endpoints.
- Fokusera på korrekt typning och återanvändbara typer.
- Logga fel i konsolen för enkel felsökning.

