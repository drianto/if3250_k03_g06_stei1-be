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
const SWAGGER_OPTIONS: swaggerUi.SwaggerUiOptions = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
  customJs: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js'
};

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, SWAGGER_OPTIONS));
app.get('/api/docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
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