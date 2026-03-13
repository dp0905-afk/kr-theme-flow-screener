import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Project, UploadedImage } from '../types';

const categories = ['Rock', 'Tree Bark', 'Branch', 'Root', 'Wood Texture', 'Organic Surface', 'Custom'];
const intents = ['Raw Scan', 'Conceptual Sculpture', 'Rhino Remodeling', '3D Printable Object', 'Texture Study'];

const scoreLabel = (count: number) => {
  if (count < 20) return 'weak';
  if (count < 50) return 'fair';
  if (count < 100) return 'good';
  return 'strong';
};

export const NewProjectWizardPage = ({ onToast }: { onToast: (msg: string) => void }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [project, setProject] = useState<Partial<Project>>({
    name: '', objectCategory: 'Rock', designIntent: 'Raw Scan', notes: '', tags: []
  });
  const [files, setFiles] = useState<File[]>([]);
  const [simulating, setSimulating] = useState(false);
  const [simStage, setSimStage] = useState('');

  const heuristics = useMemo(() => {
    const blur = files.some((f) => f.size < 60_000);
    return {
      coverage: files.length >= 40 ? 'Comprehensive around-object capture' : 'Needs more perimeter passes',
      quality: files.length >= 50 ? 'Likely fair-to-strong mesh output' : 'Likely partial mesh with soft detail',
      reflective: files.some((f) => /wet|gloss|reflect/i.test(f.name)),
      blur,
      angleDiversity: files.length >= 24
    };
  }, [files]);

  const saveBaseProject = async (): Promise<Project | null> => {
    if (!project.name?.trim()) { onToast('Project name is required'); return null; }
    const created = await api.createProject(project);
    if (files.length > 0) await api.uploadImages(created.id, files);
    const refreshed = await api.getProject(created.id);
    return refreshed;
  };

  const runSimulation = async () => {
    const created = await saveBaseProject();
    if (!created) return;

    setSimulating(true);
    const stages = ['Aligning photos', 'Estimating geometry', 'Building mesh', 'Generating texture', 'Optimizing export'];
    for (const s of stages) {
      setSimStage(s);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 650));
    }
    const confidence = Math.min(95, Math.max(30, created.images.length + (heuristics.angleDiversity ? 20 : 0) - (heuristics.blur ? 15 : 0)));
    await api.updateProject(created.id, {
      pipelineStep: 6,
      status: confidence > 75 ? 'Rhino Ready' : 'Ready for Cleanup',
      confidence,
      exportReadiness: Math.min(99, confidence + 8),
      optimization: {
        polygonDensity: 'High',
        watertightMesh: true,
        holeFilling: true,
        surfaceSmoothing: false,
        preserveNaturalDetail: true,
        rhinoFriendlyTopology: true,
        suggestedOutput: 'Rhino workflow package'
      }
    });
    onToast('Project pipeline simulated successfully');
    navigate(`/projects/${created.id}`);
  };

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold">New Project Wizard</h2>
      <div className="grid grid-cols-6 gap-2 text-xs">
        {['Info', 'Upload', 'Assessment', 'Reconstruction', 'Optimization', 'Summary'].map((label, i) => (
          <button key={label} onClick={() => setStep(i + 1)} className={`rounded-full py-2 ${step === i + 1 ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600'}`}>{i + 1}. {label}</button>
        ))}
      </div>

      {step === 1 && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <input className="w-full px-3 py-2 rounded-lg border" placeholder="Project name" value={project.name} onChange={(e) => setProject({ ...project, name: e.target.value })} />
          <div className="grid md:grid-cols-2 gap-4">
            <select className="px-3 py-2 rounded-lg border" value={project.objectCategory} onChange={(e) => setProject({ ...project, objectCategory: e.target.value })}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
            <select className="px-3 py-2 rounded-lg border" value={project.designIntent} onChange={(e) => setProject({ ...project, designIntent: e.target.value })}>{intents.map((i) => <option key={i}>{i}</option>)}</select>
          </div>
          <textarea className="w-full px-3 py-2 rounded-lg border min-h-28" placeholder="Notes" value={project.notes} onChange={(e) => setProject({ ...project, notes: e.target.value })} />
        </div>
      )}

      {step === 2 && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <label className="border-2 border-dashed border-stone-300 rounded-2xl min-h-36 grid place-items-center text-stone-500 cursor-pointer">
            <div className="text-center">
              <p>Drag-and-drop or choose images</p>
              <p className="text-xs">Capture score: {scoreLabel(files.length)} ({files.length} images)</p>
            </div>
            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => setFiles((curr) => [...curr, ...Array.from(e.target.files ?? [])])} />
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {files.map((file, idx) => (
              <button key={`${file.name}-${idx}`} onClick={() => setFiles(files.filter((_, i) => i !== idx))} className="text-left p-2 rounded-lg bg-stone-100 text-xs hover:bg-stone-200">{file.name}</button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="glass rounded-2xl p-6">
          <ul className="space-y-2 text-sm">
            <li>✅ Coverage completeness: {heuristics.coverage}</li>
            <li>✅ Likely reconstruction quality: {heuristics.quality}</li>
            <li>{heuristics.reflective ? '⚠️' : '✅'} Reflective surface warning</li>
            <li>{heuristics.blur ? '⚠️' : '✅'} Blurry image warning</li>
            <li>{heuristics.angleDiversity ? '✅' : '⚠️'} Angle diversity check</li>
          </ul>
        </div>
      )}

      {step === 4 && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <p className="text-sm text-stone-500">MVP simulation only — no true photogrammetry processing is executed.</p>
          <button onClick={runSimulation} disabled={simulating} className="px-4 py-2 rounded-xl bg-stone-900 text-white disabled:opacity-60">{simulating ? `Processing: ${simStage}` : 'Run Reconstruction Simulation'}</button>
        </div>
      )}

      {step === 5 && <div className="glass rounded-2xl p-6 text-sm text-stone-600">Optimization settings are generated after simulation and can be edited in Project Detail.</div>}
      {step === 6 && <div className="glass rounded-2xl p-6 text-sm text-stone-600">Output summary and downloads are available in Project Detail after project creation.</div>}
    </section>
  );
};
