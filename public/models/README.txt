# 3D Models Directory

This directory should contain the following 3D model files required by the Tender Opulence Hub application:

- vault-door.glb - 3D model for the animated vault door in the hero section

## Placeholder Options

During development, if you don't have the actual 3D models, you can:

1. Create simple geometries directly in Three.js:
   ```jsx
   // Instead of loading an external GLB file
   <mesh>
     <boxGeometry args={[1, 2, 0.2]} />
     <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
   </mesh>
   ```

2. Use free models from sources like:
   - Sketchfab (many free models available)
   - Google Poly Archive
   - TurboSquid (has free options)

## Format Requirements

- Preferred formats: GLB or GLTF (binary or JSON)
- Polygon count: Keep below 50k polygons per model for good performance
- Textures: Embedded in the GLB file or placed in the textures directory
- Scale: Models should use consistent scale (preferably meters)
- Origin: Place model pivots at appropriate positions for animations

## Conversion Tips

If you have models in other formats (FBX, OBJ, etc.):

1. Use Blender to import and export as GLB
2. Online converters like https://anyconv.com/3d-converter/
3. Three.js editor can also be used to import/export models 