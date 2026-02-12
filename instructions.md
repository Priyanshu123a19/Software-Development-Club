# Build and Run Instructions

These steps cover a fresh clone or a pull to the latest commit.

## Install dependencies
```bash
npm install
```

## Development
```bash
npm run dev
```
Then open http://localhost:3000

## Production build
```bash
npm run build
```

## Run production server
```bash
npm run start
```

## Lint (optional)
```bash
npm run lint
```

## Prisma (if using database features)
If your environment uses the database, ensure your environment variables are set and run:
```bash
npx prisma generate
```
If you have migrations to apply, run:
```bash
npx prisma migrate deploy
```
