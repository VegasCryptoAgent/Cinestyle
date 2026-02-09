
export interface VideoReference {
  id: string;
  type: 'url' | 'file';
  value: string; // URL string or base64
  name?: string;
  mimeType?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface StoryboardScene {
  sceneNumber: number;
  title: string;
  description: string;
  cameraMovement: string;
  lightingStyle: string;
  visualPrompt: string; 
  imageUrl?: string;
}

export interface ProjectState {
  title: string;
  script: string;
  references: VideoReference[];
  status: 'idle' | 'analyzing' | 'storyboarding' | 'generating_images' | 'completed' | 'error';
  error?: string;
  storyboard: StoryboardScene[];
  styleAnalysis?: string;
  sources?: GroundingSource[];
}
