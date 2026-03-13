import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { OptimizationSettings, Project } from '../types';

const statuses: Project['status'][] = ['Draft', 'Ready for Cleanup', 'Rhino Ready', 'Print Ready'];

const summaryFor = (project: Project) => ({
  projectName: project.name,
  recommendation: 'photogrammetry mesh -> mesh cleanup -> Rhino QuadRemesh -> SubD refinement -> STL export for print',
  usage: ['exhibition object', 'ceramic mold reference', 'product concept form', 'sculptural interior object', 'texture study asset'],
  optimization: project.optimization,
  confidence: project.confidence,
  readiness: project.exportReadiness
});

const downloadText = (filename: string, body: string) => {
  const blob = new Blob([body], { type: 'text/plain' });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(href);
};

export const ProjectDetailPage = ({ onToast }: { onToast: (msg: string) => void }) => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => { if (id) void api.getProject(id).then(setProject); }, [id]);
  if (!project) return <div className="glass rounded-2xl p-8 animate-pulse h-52" />;

  const save = async (patch: Partial<Project>) => {
    const updated = await api.updateProject(project.id, patch);
    setProject(updated);
    onToast('Project updated');
  };

  const setOptimization = (patch: Partial<OptimizationSettings>) => {
    void save({ optimization: { ...project.optimization, ...patch } });
  };

  const summary = summaryFor(project);

  return (
    <section className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-semibold">{project.name}</h2>
            <p className="text-stone-500">{project.objectCategory} · {project.designIntent}</p>
          </div>
          <select className="rounded-lg border px-3 py-2" value={project.status} onChange={(e) => void save({ status: e.target.value as Project['status'] })}>
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <article className="glass rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-medium mb-3">Uploaded images ({project.images.length})</h3>
          {project.images.length === 0 ? <p className="text-sm text-stone-500">No images uploaded yet.</p> : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {project.images.map((img) => (
                <figure key={img.id} className="rounded-xl overflow-hidden bg-stone-100">
                  <img src={img.url} alt={img.name} className="h-24 w-full object-cover" />
                  <figcaption className="text-xs p-2 truncate">{img.name}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </article>

        <article className="glass rounded-2xl p-5 space-y-2">
          <h3 className="font-medium">Pipeline progress</h3>
          <p className="text-sm">Confidence meter: {project.confidence}%</p>
          <div className="h-2 rounded-full bg-stone-200"><div className="h-full rounded-full bg-moss" style={{ width: `${project.confidence}%` }} /></div>
          <p className="text-sm">Export readiness: {project.exportReadiness}%</p>
          <div className="h-2 rounded-full bg-stone-200"><div className="h-full rounded-full bg-stone-900" style={{ width: `${project.exportReadiness}%` }} /></div>
          <p className="text-xs text-stone-500">Mock 3D preview placeholder</p>
          <div className="h-24 rounded-xl bg-gradient-to-br from-stone-200 to-stone-300" />
        </article>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <article className="glass rounded-2xl p-5 space-y-3">
          <h3 className="font-medium">Mesh optimization settings</h3>
          <select className="rounded-lg border px-3 py-2 w-full" value={project.optimization.polygonDensity} onChange={(e) => setOptimization({ polygonDensity: e.target.value as OptimizationSettings['polygonDensity'] })}>{['Low', 'Medium', 'High', 'Ultra'].map((p) => <option key={p}>{p}</option>)}</select>
          {[
            ['watertightMesh', 'Watertight mesh'],
            ['holeFilling', 'Hole filling'],
            ['surfaceSmoothing', 'Surface smoothing'],
            ['preserveNaturalDetail', 'Preserve natural detail'],
            ['rhinoFriendlyTopology', 'Rhino-friendly topology']
          ].map(([key, label]) => (
            <label key={key} className="flex justify-between text-sm">
              {label}
              <input type="checkbox" checked={project.optimization[key as keyof OptimizationSettings] as boolean} onChange={(e) => setOptimization({ [key]: e.target.checked } as Partial<OptimizationSettings>)} />
            </label>
          ))}
        </article>

        <article className="glass rounded-2xl p-5 space-y-3">
          <h3 className="font-medium">Output summary</h3>
          <p className="text-sm">Recommended workflow: {summary.recommendation}</p>
          <p className="text-sm">Suggested output: {project.optimization.suggestedOutput}</p>
          <p className="text-sm">Recommended usage: {summary.usage.join(', ')}</p>
          <textarea className="w-full min-h-28 px-3 py-2 rounded-lg border" value={project.notes} onChange={(e) => setProject({ ...project, notes: e.target.value })} onBlur={() => void save({ notes: project.notes })} />
          <div className="flex flex-wrap gap-2 text-sm">
            <button className="px-3 py-2 rounded-lg bg-stone-900 text-white" onClick={() => downloadText(`${project.name}.json`, JSON.stringify(summary, null, 2))}>Download Project JSON</button>
            <button className="px-3 py-2 rounded-lg bg-stone-200" onClick={() => downloadText(`${project.name}-workflow.txt`, `${summary.recommendation}\n\n${summary.usage.join('\n')}`)}>Download Workflow Summary</button>
            <button className="px-3 py-2 rounded-lg bg-stone-200" onClick={() => downloadText(`${project.name}-stl-plan.txt`, 'Export STL Plan (MVP Placeholder)')}>Export STL Plan</button>
            <button className="px-3 py-2 rounded-lg bg-stone-200" onClick={() => downloadText(`${project.name}-rhino-notes.txt`, 'Export Rhino Prep Notes (MVP Placeholder)')}>Export Rhino Prep Notes</button>
          </div>
        </article>
      </div>
    </section>
  );
};
