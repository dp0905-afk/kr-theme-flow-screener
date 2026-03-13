const stages = [
  'Photo upload',
  'Quality assessment',
  'Reconstruction simulation',
  'Mesh cleanup plan',
  'Rhino prep plan',
  'Print preparation'
];

export const DemoWorkflowPage = () => (
  <section className="space-y-6">
    <h2 className="text-3xl font-semibold">Demo Workflow · Basalt Rock Study</h2>
    <p className="text-stone-500 max-w-3xl">Explore a staged project showcasing how NatureForm 3D guides natural photo sets into realistic design-and-fabrication recommendations.</p>
    <div className="grid md:grid-cols-2 gap-4">
      {stages.map((stage, i) => (
        <article key={stage} className="glass rounded-2xl p-5">
          <p className="text-xs text-stone-500">Stage {i + 1}</p>
          <h3 className="text-xl font-medium">{stage}</h3>
          <div className="mt-4 h-28 rounded-xl bg-gradient-to-r from-stone-100 to-stone-200" />
        </article>
      ))}
    </div>
  </section>
);
