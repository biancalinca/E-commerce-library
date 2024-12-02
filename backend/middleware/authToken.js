const jwt = require('jsonwebtoken')

//Middleware pentru autentificarea utilizatorului prin token JWT.
async function authToken (req, res, next) {

    try {
        //Obține token-ul din cookies. Dacă req.cookies există, se accesează proprietatea token.
        const token = req.cookies?.token 
        // console.log("Token primit:", token);
        
        //Verifică dacă token-ul nu există. Dacă nu există, se trimite un răspuns JSON cu statusul 401 (Unauthorized), indicând că utilizatorul nu este logat și returnează o eroare.
        if(!token){
            return res.status(401).json({
                message: "Te rog autentifica-te pentru a adauga produse in cosul de cumparaturi",
                error: true,
                sucess: false
            })
        }

        //Verifică token-ul folosind metoda verify din jsonwebtoken. Aceasta folosește token-ul și cheia secretă (process.env.TOKEN_SECRET_KEY) pentru a decoda token-ul. Dacă există o eroare, aceasta este transmisă ca err. Dacă token-ul este valid, informațiile decodate sunt transmise ca decoded.
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, { algorithms: ['HS512'] }, function(err, decoded) {
            // console.log("eroare in authtoken?",err)
            // console.log("decoded", decoded)

            //Dacă există o eroare la verificarea token-ului, aceasta este logată în consolă.
            if(err){
                console.log("eroare auth", err)
                return res.status(403).json({
                    message: "Token invalid sau expirat/Forbidden",
                    error: true,
                    success: false
                });
            }
            // console.log("Token valid, utilizator ID:", decoded._id);
            //Dacă token-ul este valid și decodarea reușește, req.userId este setat la ID-ul utilizatorului (_id) din informațiile decodate.
            req.userId = decoded?._id

            //Apelează funcția next() pentru a trece la următorul middleware din ciclu, dacă token-ul este valid și req.userId a fost setat corect.
            next()
        })

    }catch (err) {
        res.status(400).json({
            message:err.message || err ,
            data : [],
            error: true,
            sucess: false
        }) 
    }
}

module.exports = authToken