import { Request, Response } from 'express';
import * as templateService from '../services/template.service';
import { successResponse, errorResponse } from '../utils/response';
import { LamCategory, TemplateType } from '@prisma/client';

/**
 * @swagger
 * tags:
 *  - name: Templates
 * description: Manajemen Template Dokumen LKPS & LED
 */
export const uploadTemplateHandler = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.userId;
        const { name, type, category } = req.body;
        const file = req.file;

        if (!file) throw new Error("File template wajib diunggah");
        if (!Object.values(TemplateType).includes(type)) throw new Error("Tipe template tidak valid (LKPS/LED)");
        if (!Object.values(LamCategory).includes(category)) throw new Error("Kategori LAM tidak valid (INFOKOM/TEKNIK)");

        const template = await templateService.uploadTemplate(name, type as TemplateType, category as LamCategory, file, userId);
        successResponse(res, template, 'Template berhasil diunggah', 201);
    } catch (err: any) {
        const code = err.message.includes('wajib diunggah') || err.message.includes('tidak valid') ? 400 : 500;
        errorResponse(res, err.message, code);
    }
};

export const getTemplatesHandler = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.userId;
        const role = (req.user as any)?.role;
        const templates = await templateService.getTemplatesForUser(userId, role);
        successResponse(res, templates, 'Berhasil mengambil daftar template');
    } catch (err: any) {
        errorResponse(res, err.message, 500);
    }
};

export const downloadTemplateHandler = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const { template } = await templateService.getTemplateById(id);
        
        const { storageProvider } = await import('../utils/storage');
        const buffer = await storageProvider.downloadFile(template.content, 'templates');
        
        const encodedName = encodeURIComponent(template.name);
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedName}`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(buffer);
    } catch (err: any) {
        const code = err.message.includes('tidak ditemukan') ? 404 : 500;
        errorResponse(res, err.message, code);
    }
};

export const deleteTemplateHandler = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        await templateService.deleteTemplate(id);
        successResponse(res, null, 'Template berhasil dihapus');
    } catch (err: any) {
        const code = err.message.includes('tidak ditemukan') ? 404 : 500;
        errorResponse(res, err.message, code);
    }
};