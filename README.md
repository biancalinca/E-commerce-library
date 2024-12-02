
# 📚 Online Bookstore E-commerce Platform 

Un proiect complet de e-commerce pentru o librărie online, dezvoltat folosind stack-ul MERN (MongoDB, Express.js, React.js, Node.js). Platforma oferă funcționalități avansate atât pentru clienți, cât și pentru administratori, cu o experiență de utilizare modernă și intuitivă.


## 🌟 Caracteristici principale

### 🔒 Gestionare utilizatori (RBAC)
Două tipuri de utilizatori:
- **Client**: poate căuta cărți, adăuga produse în coș și wishlist, lăsa recenzii și achiziționa cărți
- **Admin**: are acces la panoul de administrare pentru gestionarea produselor, comenzilor și utilizatorilor.

### 📖 Funcționalități pentru clienți
- **Navigare ușoară**: Caută, filtrează și sortează cărțile după diferite criterii (gen, autor, preț, etc.).

- **Recenzii**: Lasă și vizualizează recenziile pentru fiecare carte.
- **Wishlist**: Adaugă cărțile preferate în wishlist pentru a le salva pentru mai târziu.
- **Coș de cumpărături**: Adaugă cărți în coș și finalizează comanda.
- **Sistem de plăți integrat**: Plăți online sigure și rapide (folosind [Stripe]).
### 🛠️ Funcționalități pentru administratori
- **Gestionare produse**: Adaugă, editează și șterge cărți din inventar.
- **Gestionare comenzi**: Vizualizează și actualizează starea comenzilor.
- **Monitorizare utilizatori**: Administrează recenziile lăsate de alți utilizatori și gestionează conturile acestora.

## 💻 **Tehnologii utilizate**

### 🖥️ **Frontend**
- **React.js:** Interfață modernă și interactivă.  
- **Redux:** Gestionarea stării aplicației.  
- **CSS / Bootstrap:** Stilizare și design responsive.  

### 🌐 **Backend**
- **Node.js:** Server backend robust.  
- **Express.js:** Framework pentru gestionarea rutelor și logica serverului.  

### 📦 **Bază de date**
- **MongoDB:** Stocarea datelor produselor, utilizatorilor și comenzilor.  
- **Mongoose:** ODM pentru MongoDB, simplificând interacțiunea cu baza de date.  

### 🔐 **Securitate**
- **Autentificare JWT:** Token-uri securizate pentru autentificarea utilizatorilor.  
- **Bcrypt.js:** Criptarea parolelor pentru protejarea datelor utilizatorilor.  

### Rularea aplicatiei
cd backend : **npm run dev**

cd ../frontend : **npm start**




