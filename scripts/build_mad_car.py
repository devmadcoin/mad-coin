"""
$MAD Car + Track — Blender Python Script
Builds a low-poly aggressive car with the mascot head as hood ornament,
and a circular neon track. Exports to glTF 2.0 (.glb)

Usage: blender -b --python build_mad_car.py
"""

import bpy
import math
import os

# Clean scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# ─── MATERIALS ───
def create_mat(name, color, roughness=0.4, metallic=0.0, emissive=None):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = (*color, 1.0)
    bsdf.inputs['Roughness'].default_value = roughness
    bsdf.inputs['Metallic'].default_value = metallic
    if emissive:
        bsdf.inputs['Emission Color'].default_value = (*emissive, 1.0)
        bsdf.inputs['Emission Strength'].default_value = 2.0
    return mat

mat_red_body = create_mat('Car_Red', (0.9, 0.0, 0.0), roughness=0.2, metallic=0.3)
mat_black = create_mat('Car_Black', (0.05, 0.05, 0.05), roughness=0.6)
mat_chrome = create_mat('Car_Chrome', (0.8, 0.8, 0.9), roughness=0.05, metallic=0.9)
mat_glass = create_mat('Car_Glass', (0.1, 0.1, 0.15), roughness=0.0, metallic=0.1)
mat_glass.blend_method = 'BLEND'
mat_neon = create_mat('Neon_Red', (1.0, 0.0, 0.0), emissive=(1.0, 0.0, 0.0))
mat_tire = create_mat('Tire', (0.02, 0.02, 0.02), roughness=0.9)
mat_rim = create_mat('Rim', (0.7, 0.7, 0.75), roughness=0.1, metallic=0.8)
mat_road = create_mat('Road', (0.08, 0.08, 0.08), roughness=0.95)
mat_road_line = create_mat('Road_Line', (1.0, 0.0, 0.0), emissive=(1.0, 0.0, 0.0))
mat_mascot_skin = create_mat('Mascot_Skin', (0.9, 0.0, 0.0), roughness=0.35)
mat_mascot_eye = create_mat('Mascot_Eye', (1.0, 1.0, 1.0), roughness=0.1)
mat_mascot_pupil = create_mat('Mascot_Pupil', (0.02, 0.02, 0.02), roughness=0.05)
mat_mascot_black = create_mat('Mascot_Black', (0.05, 0.05, 0.05), roughness=0.6)

def smooth_shade(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = True

# ─── MAD CAR ───

# Main body — low, wide, aggressive
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.35))
body = bpy.context.active_object
body.name = 'CarBody'
body.scale = (0.9, 2.0, 0.35)
body.data.materials.append(mat_red_body)
smooth_shade(body)

# Add subdivision
mod = body.modifiers.new(name='Subdivision', type='SUBSURF')
mod.levels = 1
mod.render_levels = 2

# Rear spoiler
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.9, 0.6))
spoiler = bpy.context.active_object
spoiler.name = 'Spoiler'
spoiler.scale = (0.8, 0.12, 0.06)
spoiler.data.materials.append(mat_black)

# Spoiler supports
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.3, -0.75, 0.52))
support_L = bpy.context.active_object
support_L.name = 'SpoilerSupport_L'
support_L.scale = (0.04, 0.04, 0.12)
support_L.data.materials.append(mat_black)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.3, -0.75, 0.52))
support_R = bpy.context.active_object
support_R.name = 'SpoilerSupport_R'
support_R.scale = (0.04, 0.04, 0.12)
support_R.data.materials.append(mat_black)

# Hood scoop
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.6, 0.55))
hood_scoop = bpy.context.active_object
hood_scoop.name = 'HoodScoop'
hood_scoop.scale = (0.35, 0.3, 0.08)
hood_scoop.data.materials.append(mat_black)

# Side skirts
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.92, 0, 0.2))
skirt_L = bpy.context.active_object
skirt_L.name = 'SideSkirt_L'
skirt_L.scale = (0.04, 1.8, 0.06)
skirt_L.data.materials.append(mat_black)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.92, 0, 0.2))
skirt_R = bpy.context.active_object
skirt_R.name = 'SideSkirt_R'
skirt_R.scale = (0.04, 1.8, 0.06)
skirt_R.data.materials.append(mat_black)

# Front splitter
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 1.05, 0.18))
splitter = bpy.context.active_object
splitter.name = 'FrontSplitter'
splitter.scale = (0.85, 0.06, 0.04)
splitter.data.materials.append(mat_black)

# Headlights
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.1, segments=12, ring_count=8, location=(-0.5, 1.0, 0.35))
headlight_L = bpy.context.active_object
headlight_L.name = 'Headlight_L'
headlight_L.scale = (1.0, 0.4, 0.6)
headlight_L.data.materials.append(mat_chrome)
smooth_shade(headlight_L)

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.1, segments=12, ring_count=8, location=(0.5, 1.0, 0.35))
headlight_R = bpy.context.active_object
headlight_R.name = 'Headlight_R'
headlight_R.scale = (1.0, 0.4, 0.6)
headlight_R.data.materials.append(mat_chrome)
smooth_shade(headlight_R)

# Taillights — neon strips
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.35, -1.05, 0.38))
taillight_L = bpy.context.active_object
taillight_L.name = 'Taillight_L'
taillight_L.scale = (0.25, 0.03, 0.06)
taillight_L.data.materials.append(mat_neon)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.35, -1.05, 0.38))
taillight_R = bpy.context.active_object
taillight_R.name = 'Taillight_R'
taillight_R.scale = (0.25, 0.03, 0.06)
taillight_R.data.materials.append(mat_neon)

# Windshield
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.2, 0.65))
windshield = bpy.context.active_object
windshield.name = 'Windshield'
windshield.scale = (0.8, 0.8, 0.04)
windshield.rotation_euler = (0.4, 0, 0)
windshield.data.materials.append(mat_glass)

# Wheels
wheel_positions = [
    (-0.75, 0.7, 0.2),   # Front Left
    (0.75, 0.7, 0.2),    # Front Right
    (-0.75, -0.7, 0.2),  # Rear Left
    (0.75, -0.7, 0.2),   # Rear Right
]

for i, pos in enumerate(wheel_positions):
    # Tire
    bpy.ops.mesh.primitive_torus_add(major_radius=0.18, minor_radius=0.09, location=pos)
    tire = bpy.context.active_object
    tire.name = f'Wheel_{i}'
    tire.rotation_euler = (0, 0, 0)
    tire.data.materials.append(mat_tire)
    
    # Rim
    bpy.ops.mesh.primitive_cylinder_add(radius=0.12, depth=0.06, location=(pos[0], pos[1], pos[2]))
    rim = bpy.context.active_object
    rim.name = f'Rim_{i}'
    rim.rotation_euler = (1.57, 0, 0)
    rim.data.materials.append(mat_rim)

# Underglow light bar
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.05))
underglow = bpy.context.active_object
underglow.name = 'Underglow'
underglow.scale = (0.7, 1.8, 0.01)
underglow.data.materials.append(mat_neon)

# Exhaust pipes
bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.3, location=(-0.25, -1.05, 0.3))
exhaust_L = bpy.context.active_object
exhaust_L.name = 'Exhaust_L'
exhaust_L.rotation_euler = (1.57, 0, 0)
exhaust_L.data.materials.append(mat_chrome)

bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.3, location=(0.25, -1.05, 0.3))
exhaust_R = bpy.context.active_object
exhaust_R.name = 'Exhaust_R'
exhaust_R.rotation_euler = (1.57, 0, 0)
exhaust_R.data.materials.append(mat_chrome)

# ─── MASCOT HEAD (Hood Ornament) ───
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.15, segments=20, ring_count=12, location=(0, 1.1, 0.6))
mascot_head = bpy.context.active_object
mascot_head.name = 'MascotHead'
mascot_head.data.materials.append(mat_mascot_skin)
smooth_shade(mascot_head)

# Eyes
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.04, segments=10, ring_count=8, location=(-0.05, 1.16, 0.62))
eye_L = bpy.context.active_object
eye_L.name = 'MascotEye_L'
eye_L.scale = (0.8, 0.6, 0.5)
eye_L.data.materials.append(mat_mascot_eye)

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.04, segments=10, ring_count=8, location=(0.05, 1.16, 0.62))
eye_R = bpy.context.active_object
eye_R.name = 'MascotEye_R'
eye_R.scale = (0.8, 0.6, 0.5)
eye_R.data.materials.append(mat_mascot_eye)

# Pupils
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.02, segments=8, ring_count=6, location=(-0.05, 1.18, 0.62))
pupil_L = bpy.context.active_object
pupil_L.name = 'MascotPupil_L'
pupil_L.data.materials.append(mat_mascot_pupil)

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.02, segments=8, ring_count=6, location=(0.05, 1.18, 0.62))
pupil_R = bpy.context.active_object
pupil_R.name = 'MascotPupil_R'
pupil_R.data.materials.append(mat_mascot_pupil)

# Angry eyebrows
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.06, 1.12, 0.68))
brow_L = bpy.context.active_object
brow_L.name = 'MascotBrow_L'
brow_L.scale = (0.06, 0.02, 0.01)
brow_L.rotation_euler = (0.3, 0, 0.4)
brow_L.data.materials.append(mat_mascot_black)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.06, 1.12, 0.68))
brow_R = bpy.context.active_object
brow_R.name = 'MascotBrow_R'
brow_R.scale = (0.06, 0.02, 0.01)
brow_R.rotation_euler = (0.3, 0, -0.4)
brow_R.data.materials.append(mat_mascot_black)

# ─── CIRCULAR TRACK ───
track_radius = 4.0
track_width = 1.2

# Road surface — torus for circular track
bpy.ops.mesh.primitive_torus_add(major_radius=track_radius, minor_radius=track_width/2, location=(0, 0, 0))
road = bpy.context.active_object
road.name = 'TrackRoad'
road.rotation_euler = (1.57, 0, 0)
road.scale = (1.0, 1.0, 0.1)
road.data.materials.append(mat_road)
smooth_shade(road)

# Center line — thin torus
bpy.ops.mesh.primitive_torus_add(major_radius=track_radius, minor_radius=0.02, location=(0, 0, 0.02))
center_line = bpy.context.active_object
center_line.name = 'TrackCenterLine'
center_line.rotation_euler = (1.57, 0, 0)
center_line.scale = (1.0, 1.0, 0.1)
center_line.data.materials.append(mat_road_line)

# Neon edge strips
bpy.ops.mesh.primitive_torus_add(major_radius=track_radius - track_width/2 - 0.05, minor_radius=0.03, location=(0, 0, 0.05))
edge_inner = bpy.context.active_object
edge_inner.name = 'TrackEdgeInner'
edge_inner.rotation_euler = (1.57, 0, 0)
edge_inner.scale = (1.0, 1.0, 0.1)
edge_inner.data.materials.append(mat_neon)

bpy.ops.mesh.primitive_torus_add(major_radius=track_radius + track_width/2 + 0.05, minor_radius=0.03, location=(0, 0, 0.05))
edge_outer = bpy.context.active_object
edge_outer.name = 'TrackEdgeOuter'
edge_outer.rotation_euler = (1.57, 0, 0)
edge_outer.scale = (1.0, 1.0, 0.1)
edge_outer.data.materials.append(mat_neon)

# Track posts with lights (8 posts)
for i in range(8):
    angle = (i / 8) * 2 * math.pi
    x = math.cos(angle) * (track_radius + track_width/2 + 0.3)
    y = math.sin(angle) * (track_radius + track_width/2 + 0.3)
    
    # Post
    bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.4, location=(x, y, 0.2))
    post = bpy.context.active_object
    post.name = f'TrackPost_{i}'
    post.data.materials.append(mat_black)
    
    # Light on top
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.06, segments=8, ring_count=6, location=(x, y, 0.42))
    light = bpy.context.active_object
    light.name = f'TrackLight_{i}'
    light.data.materials.append(mat_neon)

# ─── PARENT EVERYTHING ───
bpy.ops.object.empty_add(type='ARROWS', location=(0, 0, 0))
root = bpy.context.active_object
root.name = '$MAD_Car'

car_objects = [
    body, spoiler, support_L, support_R, hood_scoop, skirt_L, skirt_R,
    splitter, headlight_L, headlight_R, taillight_L, taillight_R,
    windshield, underglow, exhaust_L, exhaust_R,
    mascot_head, eye_L, eye_R, pupil_L, pupil_R, brow_L, brow_R
]

# Get all wheels (they were created dynamically)
for obj in bpy.context.scene.objects:
    if obj.name.startswith('Wheel_') or obj.name.startswith('Rim_'):
        car_objects.append(obj)

for obj in car_objects:
    obj.parent = root

# Parent track separately
bpy.ops.object.empty_add(type='ARROWS', location=(0, 0, 0))
track_root = bpy.context.active_object
track_root.name = '$MAD_Track'

track_objects = [road, center_line, edge_inner, edge_outer]
for obj in bpy.context.scene.objects:
    if obj.name.startswith('TrackPost_') or obj.name.startswith('TrackLight_'):
        track_objects.append(obj)

for obj in track_objects:
    obj.parent = track_root

# ─── STUDIO LIGHTING ───
# Key light
bpy.ops.object.light_add(type='SUN', location=(5, 5, 8))
key = bpy.context.active_object
key.name = 'KeyLight'
key.data.energy = 4.0
key.data.color = (1.0, 0.95, 0.9)

# Fill
bpy.ops.object.light_add(type='AREA', location=(-4, 2, 4))
fill = bpy.context.active_object
fill.name = 'FillLight'
fill.data.energy = 2.0
fill.data.color = (0.85, 0.9, 1.0)
fill.data.size = 4.0

# Rim red
bpy.ops.object.light_add(type='SPOT', location=(0, -3, -2))
rim = bpy.context.active_object
rim.name = 'RimLight'
rim.data.energy = 8.0
rim.data.color = (1.0, 0.2, 0.2)
rim.data.spot_size = 1.5

# Underglow bounce
bpy.ops.object.light_add(type='POINT', location=(0, 0, -0.5))
bounce = bpy.context.active_object
bounce.name = 'BounceLight'
bounce.data.energy = 2.0
bounce.data.color = (1.0, 0.3, 0.3)

# ─── EXPORT ───
output_path = '/tmp/mad_car.glb'

bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    export_materials='EXPORT',
    export_image_format='WEBP',
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
    export_draco_position_quantization=11,
    export_draco_normal_quantization=10,
    export_draco_texcoord_quantization=10,
    export_draco_color_quantization=10,
    export_draco_generic_quantization=10,
    export_tangents=False,
    export_yup=True,
    export_cameras=False,
    export_lights=False,
)

print(f"✅ MAD Car + Track exported to: {output_path}")
print(f"📦 File size: {os.path.getsize(output_path) / 1024:.1f} KB")
