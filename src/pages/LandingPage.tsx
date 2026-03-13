import { Link } from 'react-router-dom';

export const LandingPage = () => (
  <section className="py-16 md:py-24 space-y-8">
    <p className="inline-block px-4 py-1 bg-moss/10 text-moss rounded-full text-sm">MVP workflow simulator for photogrammetry + fabrication</p>
    <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-stone-900 max-w-4xl">Turn Natural Forms into Conceptual 3D Assets</h1>
    <p className="text-lg text-stone-600 max-w-3xl">Upload photos of rocks, bark, branches, and organic forms. Organize them into a clean pipeline for 3D reconstruction, Rhino modeling, and 3D printing.</p>
    <div className="flex gap-3">
      <Link to="/wizard" className="px-5 py-3 rounded-xl bg-stone-900 text-white">Start Project</Link>
      <Link to="/demo" className="px-5 py-3 rounded-xl bg-white border border-stone-300">View Demo Workflow</Link>
    </div>
    <div className="glass rounded-3xl p-6 text-sm text-stone-600">NatureForm 3D is a realistic MVP simulation: it prepares project intelligence, mesh cleanup settings, and export plans for future photogrammetry and Rhino integration. It does not perform full automated CAD reconstruction yet.</div>
  </section>
);
