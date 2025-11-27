// Importar dotenv al inicio para cargar variables de entorno
require('dotenv').config(); 

// Importaciones
const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('./config/db.js');

// Importa las rutas personalizadas
const authRoutes = require('./routes/auth.routes.js');
const bookRoutes = require('./routes/book.routes.js');
const userRoutes = require('./routes/user.routes.js');
const checkoutRoutes = require('./routes/checkout.routes.js');
const aiGeminiRoutes = require('./routes/aiGemini.routes');
const uploadFile = require('./routes/uploadFile.routes.js');

// Crea una instancia de la aplicación Express
const PORT = process.env.PORT || 3000;
const app = express();

// Habilitamos CORS usando las variables de entorno
app.use(cors({
  origin: [
    process.env.FRONTEND_LOCAL_URL, // http://localhost:4200
    process.env.FRONTEND_PROD_URL  // https://main.d17jgtfjujlttk.amplifyapp.com
  ],
  credentials: true
}));
app.use(express.json());

// Usamos la variable de entorno para el secreto de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'some secret', // Usar variable
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, sameSite: 'lax' }
}));

// Ruta de prueba
app.get('/', (req, res) => res.send('¡Backend funcionando con CommonJS! 🚀'));

// ---------- Cargamos openid-client dinámicamente ----------
(async () => {
  try {
    const openid = await import('openid-client');
    const { Issuer, generators } = openid.default || openid;
    
    // Obtener variables de Cognito del entorno
    const ISSUER_URL = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`;
    const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
    const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;
    const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN;
    const LOGOUT_URI = process.env.COGNITO_LOGOUT_URI;
    
    // Lista de URIs que el cliente OpenID debe aceptar (local y producción)
    const REDIRECT_URIS = [
        `${process.env.FRONTEND_PROD_URL}/home`, 
        `${process.env.FRONTEND_LOCAL_URL}/login` // <-- IMPORTANTE: La URL de callback local
    ];


    // Cognito OpenID Client
    const issuer = await Issuer.discover(ISSUER_URL);

    const client = new issuer.Client({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      // Incluir ambas URLs de redirección que usará tu app
      redirect_uris: REDIRECT_URIS, 
      response_types: ['code']
    });

    console.log('✅ Cognito client inicializado');

    // ---------- Rutas Cognito ----------
    app.get('/login', (req, res) => {
      const codeVerifier = generators.codeVerifier();
      const codeChallenge = generators.codeChallenge(codeVerifier);
      req.session.codeVerifier = codeVerifier;

      const url = client.authorizationUrl({
        scope: 'openid email profile',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      });

      res.redirect(url);
    });

    app.get('/callback', async (req, res) => {
      try {
        if (!req.session || !req.session.codeVerifier) {
          return res.status(400).send('CodeVerifier no encontrado en sesión');
        }

        const params = client.callbackParams(req);
        
        // Determinar la URI que se usó en el frontend para la validación
        const isLocal = req.headers.referer && req.headers.referer.includes('localhost');
        const callbackUri = isLocal 
            ? `${process.env.FRONTEND_LOCAL_URL}/login`
            : `${process.env.FRONTEND_PROD_URL}/home`;

        const tokenSet = await client.callback(
          callbackUri,
          params,
          { code_verifier: req.session.codeVerifier }
        );

        req.session.tokenSet = tokenSet;
        res.json({ message: 'Login exitoso con Cognito ✅', token: tokenSet });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en callback de Cognito' });
      }
    });

    // LOGOUT 
    app.get('/logout', (req, res) => {
      req.session.destroy(() => {
        // Usar variables de entorno para la URL de logout
        const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${LOGOUT_URI}`;
        res.redirect(logoutUrl);
      });
    });
    
    // Rutas internas
    app.use('/api/auth', authRoutes);
    app.use('/api/books', bookRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/checkout', checkoutRoutes);
    app.use('/api/ai', aiGeminiRoutes);
    app.use('/api/upload', uploadFile);

    // Iniciar servidor después de Cognito
    app.listen(PORT, () =>
      console.log(`Servidor escuchando en http://localhost:${PORT}`)
    );

  } catch (err) {
    console.error('❌ Error cargando openid-client:', err);
  }
})();