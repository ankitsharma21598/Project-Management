# 🎨 Frontend – Project Management System

This is the frontend application for the Project Management System, built using **Vite + React + TypeScript** and powered by **GraphQL (Apollo Client)**.

---

## 🧰 Tech Stack

- React (Vite)
- TypeScript
- Apollo Client
- GraphQL
- Tailwind CSS
- Redux Toolkit
- React Router

---

## 📂 Folder Structure

```

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── graphql/
│   │   ├── queries.ts
│   │   └── mutations.ts
│   ├── store/
│   ├── types/
│   ├── lib/
│   ├── layouts/
│   └── main.tsx
├── index.css
├── vite.config.ts
├── Dockerfile
├── package.json
└── README.md

````

---

## ⚙️ Environment Variables

Create a `.env` file in the `frontend` directory.

```env
VITE_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
````

---

## ▶️ Run Locally

```bash
cd frontend
npm install
npm run dev
```

Application runs at:

```
http://localhost:5173
```

---

## 🔗 GraphQL & Apollo Client

* Uses Apollo Client for GraphQL communication
* JWT token sent via `Authorization` header
* Automatic cache updates and refetching
* Error handling via Apollo links

---

## 🎨 Styling

* Tailwind CSS
* CSS variables for theme support
* Responsive and mobile-friendly UI

---

## ▶️ Run with Docker

```bash
docker build -t project-management-frontend .
docker run -p 5173:80 project-management-frontend
```

---

## 📄 License

MIT License

```

---

If you want:
- `.env.example`
- Apollo cache best practices
- Folder structure improvements
- UI performance optimization

Just say 👍
```
