import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { v4 as uuid } from 'uuid';
import { getDbPath, readProjects, writeProjects } from './store.js';
import { Project, UploadedImage } from './types.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const uploadDir = path.join(process.cwd(), 'server', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`)
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(uploadDir));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: getDbPath() });
});

app.get('/api/projects', (_req, res) => {
  res.json(readProjects());
});

app.get('/api/projects/:id', (req, res) => {
  const project = readProjects().find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  return res.json(project);
});

app.post('/api/projects', (req, res) => {
  const body = req.body as Partial<Project>;
  if (!body.name || !body.objectCategory || !body.designIntent) {
    return res.status(400).json({ message: 'name, objectCategory and designIntent are required' });
  }

  const project: Project = {
    id: uuid(),
    name: body.name,
    objectCategory: body.objectCategory,
    designIntent: body.designIntent,
    notes: body.notes ?? '',
    tags: body.tags ?? [],
    images: body.images ?? [],
    status: body.status ?? 'Draft',
    exportReadiness: body.exportReadiness ?? 8,
    lastEdited: new Date().toISOString(),
    pipelineStep: body.pipelineStep ?? 1,
    confidence: body.confidence ?? 20,
    optimization: body.optimization ?? {
      polygonDensity: 'Medium',
      watertightMesh: true,
      holeFilling: true,
      surfaceSmoothing: false,
      preserveNaturalDetail: true,
      rhinoFriendlyTopology: true,
      suggestedOutput: 'STL'
    }
  };

  const projects = readProjects();
  projects.unshift(project);
  writeProjects(projects);
  return res.status(201).json(project);
});

app.put('/api/projects/:id', (req, res) => {
  const projects = readProjects();
  const idx = projects.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Project not found' });

  const merged: Project = {
    ...projects[idx],
    ...req.body,
    id: projects[idx].id,
    lastEdited: new Date().toISOString()
  };

  projects[idx] = merged;
  writeProjects(projects);
  return res.json(merged);
});

app.delete('/api/projects/:id', (req, res) => {
  const projects = readProjects();
  const next = projects.filter((p) => p.id !== req.params.id);
  if (next.length === projects.length) return res.status(404).json({ message: 'Project not found' });
  writeProjects(next);
  return res.status(204).send();
});

app.post('/api/projects/:id/upload', upload.array('images', 200), (req, res) => {
  const projects = readProjects();
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const files = (req.files as Express.Multer.File[]) ?? [];
  const newImages: UploadedImage[] = files.map((file, index) => ({
    id: uuid(),
    name: file.originalname,
    url: `/uploads/${file.filename}`,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    blurRisk: file.size < 50_000,
    reflectiveRisk: /wet|gloss|reflect/i.test(file.originalname),
    angleTag: ['front', 'side', 'top', 'detail'][index % 4] as UploadedImage['angleTag']
  }));

  project.images = [...project.images, ...newImages];
  project.lastEdited = new Date().toISOString();
  project.exportReadiness = Math.min(100, project.exportReadiness + newImages.length);
  writeProjects(projects);
  return res.json(newImages);
});

app.listen(PORT, () => {
  console.log(`NatureForm 3D server running on http://localhost:${PORT}`);
});
