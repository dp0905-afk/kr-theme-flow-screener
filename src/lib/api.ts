import { Project, UploadedImage } from '../types';

const jsonHeaders = { 'Content-Type': 'application/json' };

export const api = {
  listProjects: async (): Promise<Project[]> => {
    const res = await fetch('/api/projects');
    return res.json();
  },
  getProject: async (id: string): Promise<Project> => {
    const res = await fetch(`/api/projects/${id}`);
    return res.json();
  },
  createProject: async (payload: Partial<Project>): Promise<Project> => {
    const res = await fetch('/api/projects', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload) });
    return res.json();
  },
  updateProject: async (id: string, payload: Partial<Project>): Promise<Project> => {
    const res = await fetch(`/api/projects/${id}`, { method: 'PUT', headers: jsonHeaders, body: JSON.stringify(payload) });
    return res.json();
  },
  deleteProject: async (id: string): Promise<void> => {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
  },
  uploadImages: async (id: string, files: File[]): Promise<UploadedImage[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    const res = await fetch(`/api/projects/${id}/upload`, { method: 'POST', body: formData });
    return res.json();
  }
};
