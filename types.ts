
export enum IconStyle {
  MINIMALIST = 'minimalist',
  MATERIAL = 'material design',
  FLAT = 'flat design',
  GRADIENT = 'gradient style',
  RETRO = 'retro style',
  NEUMORPHISM = 'neumorphism style',
  SKETCH = 'hand-drawn sketch style',
}

export enum IconShape {
  CIRCLE = 'circle',
  SQUARE = 'square',
  SQUIRCLE = 'squircle', // A square with rounded corners, common in Android
  TEARDROP = 'teardrop',
}

export interface GeneratedIcon {
  id: string;
  url: string; // Base64 data URL
  prompt: string;
}
