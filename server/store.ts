import fs from 'node:fs';
import path from 'node:path';
import { seedProjects } from './seed.js';
import { Project } from './types.js';

const dataDir = path.join(process.cwd(), 'server', 'data');
const dbPath = path.join(dataDir, 'projects.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify(seedProjects, null, 2));
}

export const readProjects = (): Project[] => {
  const raw = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(raw) as Project[];
};

export const writeProjects = (projects: Project[]): void => {
  fs.writeFileSync(dbPath, JSON.stringify(projects, null, 2));
};

export const getDbPath = (): string => dbPath;
