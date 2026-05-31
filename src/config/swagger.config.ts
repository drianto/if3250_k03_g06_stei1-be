import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const getBaseUrl = () => {
  if (process.env.API_URL) return process.env.API_URL;
  if (process.env.NODE_ENV === 'production') return 'https://if3250-k03-g06-stei1-be.vercel.app';
  return `http://localhost:${process.env.PORT || 8000}`;
};

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'STEI Akreditasi API',
      version: '1.0.0',
      description:
        'API documentation for Sistem Terintegrasi Repository dan Dashboard Data Akreditasi STEI ITB',
    },
    servers: [
      {
        url: getBaseUrl(),
        description: process.env.NODE_ENV === 'production' ? 'Production server (Vercel)' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ProdiSummary: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            fullname: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: {
              type: 'string',
              enum: ['SUPER_ADMIN', 'PIMPINAN', 'KAPRODI', 'TIM_PRODI'],
            },
            isActive: { type: 'boolean' },
            prodiId: { type: 'string', nullable: true },
            prodi: {
              oneOf: [{ $ref: '#/components/schemas/ProdiSummary' }, { type: 'null' }],
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@itb.ac.id' },
            password: { type: 'string', format: 'password', example: 'password123' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'name', 'password', 'role'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@itb.ac.id' },
            name: { type: 'string', example: 'Budi Santoso' },
            password: { type: 'string', format: 'password', example: 'password123' },
            role: {
              type: 'string',
              enum: ['SUPER_ADMIN', 'PIMPINAN', 'KAPRODI', 'TIM_PRODI'],
            },
            prodiId: { type: 'string', nullable: true },
          },
        },
        CreateAccountRequest: {
          type: 'object',
          required: ['email', 'name', 'role'],
          description:
            'Untuk role TIM_PRODI dan KAPRODI, field prodiId wajib diisi.',
          properties: {
            email: { type: 'string', format: 'email', example: 'dosen@itb.ac.id' },
            name: { type: 'string', minLength: 3, maxLength: 100, example: 'Budi Santoso' },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              example: 'password123',
            },
            role: {
              type: 'string',
              enum: ['SUPER_ADMIN', 'PIMPINAN', 'KAPRODI', 'TIM_PRODI'],
            },
            prodiId: { type: 'string', nullable: true },
          },
        },
        UpdateAccountRequest: {
          type: 'object',
          description:
            'Jika role diubah menjadi TIM_PRODI atau KAPRODI maka prodiId wajib diisi.',
          properties: {
            name: { type: 'string', minLength: 3, maxLength: 100 },
            role: {
              type: 'string',
              enum: ['SUPER_ADMIN', 'PIMPINAN', 'KAPRODI', 'TIM_PRODI'],
            },
            isActive: { type: 'boolean' },
            prodiId: { type: 'string', nullable: true },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string' },
            data: {},
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Terjadi kesalahan pada server atau input tidak valid' },
            error: {
              type: 'object',
              description: 'Metadata standar error',
              properties: {
                code: { type: 'number', example: 400 },
                type: { type: 'string', example: 'BAD_REQUEST' },
                timestamp: { type: 'string', format: 'date-time', example: '2026-05-17T17:49:00.000Z' },
              }
            },
            details: {
              type: 'array',
              description: 'Opsional. Biasanya berisi detail error validasi dari Zod.',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'password' },
                  message: { type: 'string', example: 'String must contain at least 8 character(s)' }
                }
              }
            }
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.ts'),
    path.join(__dirname, '../controllers/*.js'),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
