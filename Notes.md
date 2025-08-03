## Povratne informacije

### 1. Konceptualni problemi i izazovi

- **Real-time komunikacija (Socket.IO)**  
  U pocetku sam imao poteškoća s razumijevanjem kako pravilno slati poruke svim korisnicima, te kako izolirati privatne razgovore između dva korisnika.

- **CORS (Cross-Origin Resource Sharing)**  
  Došlo je do problema pristupa između frontend i backend servisa zbog sigurnosnih ograničenja u pregledniku, zbog čega zahtjevi nisu prolazili prema backendu.

- **Docker i mrežna komunikacija između servisa**  
  Kada sam po prvi put pokretao aplikaciju u Docker kontejnerima, frontend (Nginx) nije mogao pristupiti backend servisu preko naziva hosta, što je izazivalo greške.

- **Reverse proxy konfiguracija (Nginx)**  
  Morao sam detaljnije shvatiti kako konfigurirati Nginx da pravilno prosljeđuje WebSocket konekcije, jer obični HTTP proxy nije bio dovoljan.

- **Responsivni dizajn i CSS prilagodba**  
  Bilo je izazovno dizajnirati aplikaciju tako da je intuitivna i ugodna za korištenje na svim veličinama ekrana (desktop, tablet, mobilni uređaji), posebno pri prikazivanju dugih korisničkih imena.

---

### 2. Pronađena rješenja

- **Socket.IO (broadcast i rooms)**  
  Korištenjem metoda kao što su `socket.broadcast.emit()` za globakne poruke i kreiranjem jedinstvenih soba (`socket.join(chatId)`) za privatne razgovore između korisnika.

- **CORS problem**  
  Implementacija `cors` middleware-a na backendu (`app.use(cors())`), uz postavljanje proxy-ja u React aplikaciji unutar `package.json` kako bi se u razvoju izbjegli problemi s različitim portovima.

- **Docker Networking**  
  Kreiranje zajedničke mreže (`docker network create`) za backend i frontend servise kako bi omogućio međusobnu komunikaciju putem naziva servisa (DNS imena).

- **WebSocket proxy (Nginx)**  
  Dodavanje specifičnih zaglavlja u Nginx konfiguraciju kako bi WebSocket zahtjevi pravilno prolazili kroz reverse proxy:
  ```nginx
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";

---

### 3. Stečeno znanje

- Naučio sam kako raditi s real-time komunikacijom pomoću **Socket.IO** biblioteke, razumjeti njene koncepte kao što su *rooms*, *event-based* komunikacija i emitovanje poruka prema određenim klijentima.
- Razumio sam zašto i kako se javlja **CORS problem** i naučio sam ga učinkovito riješiti implementacijom odgovarajućeg middleware-a na backend strani.
- Stekao sam temeljna znanja o radu s **Docker** kontejnerima, uključujući kreiranje mreža, višestupanjske Docker build procese te korištenje **Docker Compose-a** za jednostavno pokretanje složenijih aplikacija.
- Shvatio sam razliku između običnog HTTP proxy-ja i **WebSocket proxy-ja** te kako konfigurirati Nginx za oba slučaja.
- Poboljšao sam sposobnosti u izradi **responzivnih web aplikacija**.

Ovaj zadatak omogućio mi je bolje razumijevanje stvarnih izazova pri izradi web aplikacija te mi dao praktično znanje koje mogu primijeniti u budućim projektima.