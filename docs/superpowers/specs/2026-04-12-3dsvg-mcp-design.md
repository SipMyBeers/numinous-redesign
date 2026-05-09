# 3dsvg MCP Server — Design Spec

**Date:** 2026-04-12
**Status:** Approved
**Author:** Dylan + Claude

## Summary

A local MCP server that generates 3D assets (GLB models + PNG renders) from SVGs, text, images, video frames, and natural language descriptions. Built on the open-source `3dsvg` engine ([renatoworks/3dsvg](https://github.com/renatoworks/3dsvg), MIT license). Outputs a distinctive pixelated/stylized aesthetic configurable from game-sprite chunky (32x32) to detailed (256x256).

## Motivation

The Numinous Designs portfolio needs 3D models for:
- Sculpture breakdown viewers (interactive GLB models on piece detail pages)
- Game assets (Forge Defenders enemies based on real sculptures)
- Brand assets (3D text, logos, decorative elements)

Currently there's no pipeline from sculpture photos/descriptions → usable 3D web assets. This MCP server closes that gap by running locally as a Claude Code tool.

## Architecture

```
Claude Code ──MCP stdio──▶ 3dsvg-mcp (Node.js process)
                              │
                              ├─ Input Layer
                              │   ├─ SVGLoader (Three.js) ── parse SVG paths
                              │   ├─ opentype.js ── text → SVG glyphs
                              │   ├─ potrace ── raster image → SVG trace
                              │   └─ fluent-ffmpeg ── video → frame extraction
                              │
                              ├─ Geometry Pipeline (pure math, no WebGL)
                              │   ├─ Grid-snap quantizer ── pixelated aesthetic
                              │   ├─ THREE.ExtrudeGeometry ── SVG → 3D mesh
                              │   └─ BufferGeometryUtils.mergeGeometries
                              │
                              ├─ Output Layer
                              │   ├─ GLTFExporter ── mesh → GLB file
                              │   └─ headless-gl + node-canvas ── mesh → PNG render
                              │
                              └─ File I/O
                                  ├─ Auto-save to output_dir (default)
                                  └─ Return base64 in response (fallback)
```

### Core Pipeline: SVG → 3D

Extracted from the `3dsvg` engine (`packages/engine/src/scene.tsx`):

1. **Parse SVG** — `SVGLoader.parse(svgString)` iterates all paths. Filled paths become `THREE.Shape[]`. Stroked paths offset into outline polygons.
2. **Grid-snap quantize** (optional) — Snap SVG path coordinates to an NxN pixel grid. Reduces organic curves to blocky pixel-art silhouettes. Resolution configurable: 32 (chunky) to 256 (detailed). Default: 64.
3. **Extrude** — `THREE.ExtrudeGeometry(shape, { depth, bevelEnabled, curveSegments })`. For pixel mode: no bevel, segments=1. For smooth mode: bevel + segments scale with smoothness param.
4. **Merge** — Combine individual geometries into single buffer.
5. **UV remap** — Triplanar UV projection based on face normals.
6. **Center + scale** — Fit geometry into 4-unit bounding box.

### Rendering Pipeline (PNG output)

Uses `headless-gl` for a WebGL context and `node-canvas` for the framebuffer:

1. Create `THREE.WebGLRenderer` with headless-gl context
2. Set up scene: mesh + `MeshPhysicalMaterial` + lights (hemisphere + directional + point)
3. Camera: perspective, positioned based on `camera_angle` param or auto-framed
4. Render to framebuffer → extract pixels → encode as PNG
5. If headless-gl fails to initialize: skip PNG, return GLB only with a warning

### Fallback Strategy

headless-gl can be finicky on some systems. If PNG rendering fails:
- Tool still succeeds — returns the GLB file
- Includes a `render_warning` field explaining PNG was skipped
- User can use `preview_render` to retry or view the GLB in-browser

## Tools

### 1. `svg_to_3d`

Convert an SVG file or string into a 3D model.

**Parameters:**
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `svg` | string | yes | — | SVG markup string OR absolute file path to .svg |
| `output_dir` | string | no | — | Directory to save files. If omitted, returns base64. |
| `filename` | string | no | auto-slugified | Base filename (without extension) |
| `depth` | number | no | 1.0 | Extrusion depth (0.1–10.0) |
| `smoothness` | number | no | 0.5 | Bevel smoothness (0.0=sharp, 1.0=smooth) |
| `pixel_resolution` | number | no | 64 | Grid-snap resolution (16–256). Set 0 for no quantization. |
| `material` | string | no | "default" | One of: default, metallic, glass, holographic, plastic, matte |
| `color` | string | no | "#cccccc" | Hex color for the material |
| `render_png` | boolean | no | true | Whether to also render a PNG preview |
| `camera_angle` | string | no | "front" | One of: front, top, side, isometric, custom |

**Returns:**
```json
{
  "glb_path": "/path/to/output.glb",
  "png_path": "/path/to/output.png",
  "glb_base64": "...",
  "png_base64": "...",
  "vertices": 1234,
  "triangles": 456,
  "render_warning": null
}
```

### 2. `text_to_3d`

Convert text into a 3D model using a Google Font.

**Parameters:**
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `text` | string | yes | — | The text to extrude |
| `font` | string | no | "Urbanist" | Google Font name |
| `output_dir` | string | no | — | Directory to save files |
| `filename` | string | no | auto-slugified | Base filename |
| `depth` | number | no | 1.0 | Extrusion depth |
| `smoothness` | number | no | 0.5 | Bevel smoothness |
| `pixel_resolution` | number | no | 0 | Grid-snap (0=smooth text by default) |
| `material` | string | no | "default" | Material preset |
| `color` | string | no | "#cccccc" | Hex color |
| `render_png` | boolean | no | true | Render PNG preview |

**Returns:** Same shape as `svg_to_3d`.

### 3. `image_to_3d`

Trace a raster image to SVG, then extrude to 3D.

**Parameters:**
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `image_path` | string | yes | — | Absolute path to JPG/PNG file |
| `output_dir` | string | no | — | Directory to save files |
| `filename` | string | no | auto-slugified | Base filename |
| `threshold` | number | no | 128 | Potrace black/white threshold (0–255) |
| `invert` | boolean | no | false | Invert image before tracing |
| `depth` | number | no | 1.0 | Extrusion depth |
| `smoothness` | number | no | 0.5 | Bevel smoothness |
| `pixel_resolution` | number | no | 64 | Grid-snap resolution |
| `material` | string | no | "default" | Material preset |
| `color` | string | no | "#cccccc" | Hex color |
| `render_png` | boolean | no | true | Render PNG preview |

**Returns:** Same shape as `svg_to_3d` plus `traced_svg` field with the intermediate SVG string.

### 4. `video_to_3d`

Extract a frame from a video, trace it, and extrude to 3D.

**Parameters:**
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `video_path` | string | yes | — | Absolute path to video file |
| `output_dir` | string | no | — | Directory to save files |
| `filename` | string | no | auto-slugified | Base filename |
| `timestamp` | string | no | "auto" | Timestamp to extract (e.g., "00:05"). "auto" picks sharpest frame. |
| `threshold` | number | no | 128 | Potrace threshold |
| `depth` | number | no | 1.0 | Extrusion depth |
| `pixel_resolution` | number | no | 64 | Grid-snap resolution |
| `material` | string | no | "default" | Material preset |
| `color` | string | no | "#cccccc" | Hex color |
| `render_png` | boolean | no | true | Render PNG preview |

**Pipeline:**
1. `ffmpeg` extracts frames (every 2s if "auto", or single frame at timestamp)
2. For "auto": score each frame by Laplacian variance (sharpness), pick best
3. Trace best frame → SVG → extrude (same as `image_to_3d`)

**Returns:** Same shape as `image_to_3d` plus `frame_timestamp` field.

### 5. `describe_to_3d`

Natural language description → pixelated 3D asset. This tool generates an SVG from the description (Claude creates it inline), then extrudes it.

**Parameters:**
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `description` | string | yes | — | What to create (e.g., "a spiky crystal sculpture") |
| `style` | string | no | "pixel" | One of: pixel, smooth, voxel |
| `output_dir` | string | no | — | Directory to save files |
| `filename` | string | no | auto-slugified | Base filename |
| `pixel_resolution` | number | no | 64 | Grid-snap resolution (16–256) |
| `depth` | number | no | 1.0 | Extrusion depth |
| `material` | string | no | "metallic" | Material preset |
| `color` | string | no | "#cccccc" | Hex color |
| `render_png` | boolean | no | true | Render PNG preview |

**Pipeline:**
1. The MCP server receives the description
2. It returns a prompt asking Claude to generate an SVG matching the description
3. Claude generates the SVG (leveraging its ability to create vector art)
4. The SVG is fed through the standard grid-snap → extrude → export pipeline

**Implementation note:** This tool uses the MCP "prompt" capability or a two-step flow where the tool returns intermediate SVG for Claude to refine. The actual SVG generation happens in the LLM, not in the MCP server — the server handles the 3D conversion.

**Returns:** Same shape as `svg_to_3d` plus `generated_svg` field.

### 6. `preview_render`

Render a PNG of an existing GLB model from a specified angle.

**Parameters:**
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `glb_path` | string | yes | — | Path to existing .glb file |
| `output_dir` | string | no | — | Directory to save PNG |
| `camera_angle` | string | no | "isometric" | front, top, side, isometric |
| `width` | number | no | 1024 | Render width in pixels |
| `height` | number | no | 1024 | Render height in pixels |
| `background` | string | no | "transparent" | Background: transparent, white, black, or hex color |

**Returns:**
```json
{
  "png_path": "/path/to/render.png",
  "png_base64": "..."
}
```

### 7. `list_fonts`

Search available Google Fonts for use with `text_to_3d`.

**Parameters:**
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `query` | string | no | — | Search term (e.g., "mono", "serif") |
| `limit` | number | no | 20 | Max results |

**Returns:**
```json
{
  "fonts": ["Urbanist", "Fira Code", "Playfair Display", ...]
}
```

## Material Presets

Mapped to `THREE.MeshPhysicalMaterial` properties:

| Preset | Metalness | Roughness | Clearcoat | Transmission | Notes |
|--------|-----------|-----------|-----------|--------------|-------|
| default | 0.0 | 0.5 | 0 | 0 | Standard diffuse |
| metallic | 1.0 | 0.2 | 0 | 0 | Brushed metal look |
| glass | 0.0 | 0.0 | 0 | 0.9 | Transparent glass |
| holographic | 0.5 | 0.1 | 1.0 | 0 | Iridescent clearcoat |
| plastic | 0.0 | 0.3 | 0.5 | 0 | Glossy plastic |
| matte | 0.0 | 0.9 | 0 | 0 | Flat matte finish |

## Pixel Quantization

The grid-snap quantizer works on SVG path coordinates before extrusion:

1. Parse all path commands (M, L, C, Q, A, Z)
2. Map SVG viewBox to NxN grid (where N = `pixel_resolution`)
3. Round each coordinate to nearest grid intersection
4. Collapse any resulting degenerate segments
5. For curves (C, Q): convert to line segments first, then snap

Effects by resolution:
- **16–32**: Extremely chunky, like game sprites. Best for Forge Defenders assets.
- **64**: Default. Recognizable silhouettes with clear pixel edges.
- **128–256**: Subtle pixelation, more detail preserved.
- **0**: No quantization — smooth organic curves as-is.

## File Structure

```
~/Projects/tools/3dsvg-mcp/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts              # MCP server entry point (stdio transport)
│   ├── tools/
│   │   ├── svg-to-3d.ts      # svg_to_3d tool handler
│   │   ├── text-to-3d.ts     # text_to_3d tool handler
│   │   ├── image-to-3d.ts    # image_to_3d tool handler
│   │   ├── video-to-3d.ts    # video_to_3d tool handler
│   │   ├── describe-to-3d.ts # describe_to_3d tool handler
│   │   ├── preview-render.ts # preview_render tool handler
│   │   └── list-fonts.ts     # list_fonts tool handler
│   ├── pipeline/
│   │   ├── svg-parser.ts     # SVGLoader wrapper + stroke→fill conversion
│   │   ├── quantizer.ts      # Grid-snap pixel quantization
│   │   ├── extruder.ts       # ExtrudeGeometry + merge + UV remap + center
│   │   ├── renderer.ts       # headless-gl PNG rendering (with fallback)
│   │   ├── exporter.ts       # GLTFExporter → GLB buffer
│   │   └── materials.ts      # Material preset definitions
│   ├── input/
│   │   ├── image-tracer.ts   # Potrace image → SVG
│   │   ├── video-extractor.ts# FFmpeg frame extraction + sharpness scoring
│   │   └── font-loader.ts    # opentype.js Google Font → SVG glyphs
│   └── utils/
│       ├── file-io.ts        # Save to disk or return base64
│       └── slugify.ts        # Filename generation
└── README.md
```

## Dependencies

| Package | Purpose | Notes |
|---------|---------|-------|
| `@modelcontextprotocol/sdk` | MCP server framework | stdio transport |
| `three` | Geometry pipeline + GLTF export | Core engine |
| `opentype.js` | Font loading, text → SVG paths | For text_to_3d |
| `potrace` | Raster image → SVG tracing | For image_to_3d |
| `gl` | headless-gl for WebGL in Node | For PNG rendering |
| `canvas` | node-canvas for headless rendering | Companion to gl |
| `fluent-ffmpeg` | Video frame extraction | For video_to_3d |
| `sharp` | Image preprocessing (resize, threshold) | Before tracing |
| `zod` | Parameter validation | MCP tool schemas |

## MCP Registration

Add to `~/.claude/settings.local.json`:

```json
{
  "mcpServers": {
    "3dsvg": {
      "command": "node",
      "args": ["~/Projects/tools/3dsvg-mcp/dist/index.js"]
    }
  }
}
```

## Error Handling

- Invalid SVG: Return error with parse details, suggest fixes
- headless-gl failure: Return GLB only, set `render_warning`
- FFmpeg not installed: Return clear error message with install instructions
- Font not found: Return error with closest matches from Google Fonts
- File write failure: Fall back to base64 return

## Testing Strategy

- Unit tests for each pipeline stage (quantizer, extruder, exporter)
- Integration tests: known SVG → expected vertex count + GLB validity
- Snapshot tests: fixed inputs → PNG pixel comparison (tolerance for headless-gl variance)
- Manual: generate assets and load in the Numinous portfolio SculptureViewer
