# Real-Time Chat aplikacija

Ova aplikacija omogućava korisnicima dopisivanje u realnom vremenu preko globalnog i privatnog chata. Sve komponente su upakovane za pokretanje putem Dockera.

---

## Pokretanje s Dockerom

1. **Build & run** (u root folderu):
   ```bash
   docker compose up --build

2. Aplikacija je dostupna na:

Frontend (React, Nginx): http://localhost:3000

Backend (Node.js, Socket.IO): http://localhost:3001

Oba servisa su automatski spojena na istu Docker mrežu, proxy i WebSocket komunikacija su već konfigurirani.

3. Arhitektura
Frontend: React + Socket.IO-client (serviran preko Nginx-a)

Backend: Node.js + Express + Socket.IO

Orkestracija: Docker Compose (frontend i backend na istoj mreži)

4. Povratne informacije
Kratke napomene o konceptualnim izazovima, rješenjima i naučenim stvarima nalaze se u NOTES.md.