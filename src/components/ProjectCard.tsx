import { Link } from 'react-router-dom';
import { Project } from '../types';

export const ProjectCard = ({ project, onDelete }: { project: Project; onDelete: (id: string) => void }) => (
  <article className="glass rounded-2xl p-5 space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-lg">{project.name}</h3>
      <span className="text-xs px-2 py-1 bg-stone-800 text-white rounded-full">{project.status}</span>
    </div>
    <p className="text-sm text-stone-500">{project.objectCategory} · {project.designIntent}</p>
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div><p className="text-stone-500">Images</p><p className="font-medium">{project.images.length}</p></div>
      <div><p className="text-stone-500">Export readiness</p><p className="font-medium">{project.exportReadiness}%</p></div>
      <div><p className="text-stone-500">Confidence</p><p className="font-medium">{project.confidence}%</p></div>
      <div><p className="text-stone-500">Edited</p><p className="font-medium">{new Date(project.lastEdited).toLocaleDateString()}</p></div>
    </div>
    <div className="flex gap-2">
      <Link className="px-3 py-2 rounded-lg bg-moss text-white text-sm" to={`/projects/${project.id}`}>Open</Link>
      <button className="px-3 py-2 rounded-lg bg-stone-200 text-sm" onClick={() => onDelete(project.id)}>Delete</button>
    </div>
  </article>
);
