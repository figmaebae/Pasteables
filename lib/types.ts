export interface HeroColumn {
  id: string;
  color: string;
  name: string;
  desc: string;
  tag: string;
  count: string;
  artStyle: string;
  svg: string;
}

export interface Tile {
  name: string;
  svg: string;
  /** Hand-built outlined version, when one exists. */
  alt?: string;
}

export interface Section {
  title: string;
  desc: string;
  palette: string[];
  base: string;
  tiles: Tile[];
}

export interface Gallery {
  id: string;
  title: string;
  subtitle: string;
  hasColor: boolean;
  /** Swatch index selected on open (default: -1, mixed). */
  defaultColor?: number;
  /** Eyes slider value on open (default: 1). */
  defaultEyes?: number;
  colors: { v: number; hex: string | null; title: string }[];
  inks: { hex: string; title: string }[];
  sections: Section[];
}
