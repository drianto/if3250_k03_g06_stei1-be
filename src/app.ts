import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { swaggerSpec } from './config/swagger.config';
import passport from './config/passport.config';
import { sessionConfig } from './config/sso.config';
import routes from './routes';
import { errorResponse } from './utils/response';

const app = express();

// Middleware global
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:", "https://cdnjs.cloudflare.com"],
      },
    },
  })
);

app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Swagger UI
app.get('/api/docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/api/docs', (_req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>STEI Akreditasi API Documentation</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
        <style>
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <redoc spec-url='/api/docs.json'></redoc>
        <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"> </script>
      </body>
    </html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(process.cwd(), 'uploads')));

// API Routes
app.use('/api', routes);

// Global 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl.startsWith('/api')) {
    errorResponse(res, `Rute ${req.method} ${req.originalUrl} tidak ditemukan di server`, 404);
  } else {
    next();
  }
});

// Global Error Handler (crash / throw Error / 500 )
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  
  const statusCode = err.status || err.statusCode || 500;
  const message = statusCode === 500 ? 'Terjadi kesalahan internal pada server' : err.message;
  
  const details = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  errorResponse(res, message, statusCode, details);
});

export default app;