import { Project } from './types.js';

export const seedProjects: Project[] = [
  {
    id: 'seed-basalt',
    name: 'Basalt Rock Study',
    objectCategory: 'Rock',
    designIntent: 'Rhino Remodeling',
    notes: 'Captured under overcast lighting near shoreline. Great aggregate texture.',
    tags: ['demo', 'basalt', 'interior'],
    status: 'Rhino Ready',
    exportReadiness: 82,
    lastEdited: new Date().toISOString(),
    pipelineStep: 6,
    confidence: 79,
    images: [],
    optimization: {
      polygonDensity: 'High',
      watertightMesh: true,
      holeFilling: true,
      surfaceSmoothing: false,
      preserveNaturalDetail: true,
      rhinoFriendlyTopology: true,
      suggestedOutput: 'Rhino workflow package'
    }
  }
];
