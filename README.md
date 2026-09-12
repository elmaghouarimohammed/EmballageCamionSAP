# EmballageCamionSAP

Application web pour calculer le poids total des emballages d'un camion.

## Stack

- **Frontend** : React + Vite + Tailwind CSS
- **Backend** : Laravel (API REST)
- **Base de données** : SQLite (par défaut)

## Démarrage rapide

### Backend (Laravel)

```bash
cd backend
php artisan serve
```

L'API est disponible sur `http://localhost:8000/api`.

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

L'application est disponible sur `http://localhost:5173`.

## API REST

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/calculations` | Liste tous les calculs |
| POST | `/api/calculations` | Enregistre un calcul |
| GET | `/api/calculations/{id}` | Affiche un calcul |
| DELETE | `/api/calculations/{id}` | Supprime un calcul |

## Structure du projet

```
EmballageCamionSAP/
├── backend/          # API Laravel
└── frontend/         # Application React
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        ├── constants/
        └── utils/
```

## Auteur

Mohammed Elmaghouari — © 2026
