
export enum SketchStyle {
  PENCIL_BW = "Pencil Sketch (B/W)",
  PENCIL_COLOR = "Pencil Sketch (Color)",
  CHARCOAL = "Charcoal Sketch",
  INK_OUTLINE = "Ink Outline",
  WATERCOLOR = "Watercolor Sketch",
  ANIME = "Anime / Manga Style",
  VINTAGE = "Vintage / Newspaper Effect",
}

export enum ArtistStyle {
  NONE = "None",
  PICASSO = "Picasso",
  VAN_GOGH = "Van Gogh",
  DA_VINCI = "Da Vinci",
}

export enum LineThickness {
  THIN = "Thin",
  MEDIUM = "Medium",
  BOLD = "Bold",
}

export enum CanvasType {
  WHITE_PAPER = "White Paper",
  NOTEBOOK = "Notebook Grid",
  WATERCOLOR_PAPER = "Watercolor Paper",
  BROWN_SHEET = "Brown Sheet",
}

export enum BackgroundOption {
    KEEP = "Keep Original",
    REMOVE = "Remove (Transparent)",
    WHITE = "White",
    SCENIC = "Scenic Landscape",
}

export interface SketchOptions {
  sketchStyle: SketchStyle;
  artistStyle: ArtistStyle;
  lineThickness: LineThickness;
  canvasType: CanvasType;
  backgroundOption: BackgroundOption;
}
