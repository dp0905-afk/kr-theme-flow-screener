export type ProjectStatus = 'Draft' | 'Ready for Cleanup' | 'Rhino Ready' | 'Print Ready';

export interface UploadedImage {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
  blurRisk?: boolean;
  reflectiveRisk?: boolean;
  angleTag?: 'front' | 'side' | 'top' | 'detail';
}

export interface OptimizationSettings {
  polygonDensity: 'Low' | 'Medium' | 'High' | 'Ultra';
  watertightMesh: boolean;
  holeFilling: boolean;
  surfaceSmoothing: boolean;
  preserveNaturalDetail: boolean;
  rhinoFriendlyTopology: boolean;
  suggestedOutput: 'STL' | 'OBJ' | 'PLY' | '3MF' | 'Rhino workflow package';
}

export interface Project {
  id: string;
  name: string;
  objectCategory: string;
  designIntent: string;
  notes: string;
  tags: string[];
  images: UploadedImage[];
  status: ProjectStatus;
  exportReadiness: number;
  lastEdited: string;
  pipelineStep: number;
  confidence: number;
  optimization: OptimizationSettings;
}
