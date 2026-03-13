import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Project } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { SkeletonGrid } from '../components/SkeletonGrid';

export const DashboardPage = ({ onToast }: { onToast: (msg: string) => void }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const load = async () => {
    setLoading(true);
    const data = await api.listProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => projects.filter((p) => `${p.name} ${p.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [projects, query]);

  const remove = async (id: string) => {
    await api.deleteProject(id);
    setProjects((curr) => curr.filter((p) => p.id !== id));
    onToast('Project deleted');
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div>
          <h2 className="text-3xl font-semibold">Project Dashboard</h2>
          <p className="text-stone-500">Manage conceptual capture-to-print pipelines.</p>
        </div>
        <div className="flex gap-2">
          <input className="px-3 py-2 rounded-xl border border-stone-300 bg-white" placeholder="Search tags or projects" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Link className="px-4 py-2 rounded-xl bg-stone-900 text-white" to="/wizard">Create New Project</Link>
        </div>
      </div>
      {loading ? <SkeletonGrid /> : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-stone-500">No projects yet. Start by creating a new NatureForm 3D project.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => <ProjectCard key={project.id} project={project} onDelete={remove} />)}
        </div>
      )}
    </section>
  );
};
