"""
$MAD Car v3 — Unified body, proper proportions, sleek silhouette
Box modeling approach: start with one cube, shape it into a car
"""

import bpy
import math
import os

# Clean scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# ─── HELPERS ───
def create_mat(name, color, roughness=0.4, metallic=0.0, emissive=None):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = (*color, 1.0)
    bsdf.inputs['Roughness'].default_value = roughness
    bsdf.inputs['Metallic'].default_value = metallic
    if emissive:
        bsdf.inputs['Emission Color'].default_value = (*emissive, 1.0)
        bsdf.inputs['Emission Strength'].default_value = 3.0
    return mat

def set_material(obj, mat):
    if len(obj.data.materials) == 0:
        obj.data.materials.append(mat)
    else:
        obj.data.materials[0] = mat

# ─── MATERIALS ───
mat_red = create_mat('Car_Red', (0.92, 0.0, 0.0), roughness=0.2, metallic=0.5)
mat_black = create_mat('Car_Black', (0.03, 0.03, 0.03), roughness=0.8)
mat_chrome = create_mat('Chrome', (0.9, 0.9, 1.0), roughness=0.02, metallic=0.98)
mat_glass = create_mat('Glass', (0.08, 0.12, 0.18), roughness=0.0, metallic=0.3)
mat_neon = create_mat('Neon_Red', (1.0, 0.0, 0.0), emissive=(1.0, 0.0, 0.0))
mat_tire = create_mat('Tire', (0.02, 0.02, 0.02), roughness=0.95)
mat_rim = create_mat('Rim', (0.85, 0.85, 0.9), roughness=0.05, metallic=0.9)
mat_road = create_mat('Road', (0.05, 0.05, 0.05), roughness=0.95)
mat_road_line = create_mat('Road_Line', (0.9, 0.0, 0.0), emissive=(0.9, 0.0, 0.0))
mat_interior = create_mat('Interior', (0.06, 0.06, 0.06), roughness=0.9)

# ─── UNIFIED CAR BODY — Box modeling approach ───
# One mesh, shaped into a car silhouette

bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
body = bpy.context.active_object
body.name = 'CarBody'
body.scale = (1.7, 3.6, 0.7)

# Apply scale before edit mode
bpy.ops.object.transform_apply(scale=True)

# Enter edit mode to shape the car
bpy.ops.object.mode_set(mode='EDIT')

# More subdivisions for smooth shaping
bpy.ops.mesh.subdivide(number_cuts=6, smoothness=0.0)
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.subdivide(number_cuts=2, smoothness=0.0)

# Back to object mode for vertex manipulation
bpy.ops.object.mode_set(mode='OBJECT')

# Store original mesh for reference
body_vertices = [(v.co.x, v.co.y, v.co.z) for v in body.data.vertices]

# ─── FRONT — Hood slope (taper down at front) ───
# Find front-most vertices (positive Y)
front_verts = [v for v in body.data.vertices if v.co.y > 1.2]
for v in front_verts:
    # Taper down at front (hood slopes down)
    slope_factor = max(0, (v.co.y - 1.2) / 1.0)  # 0 at 1.2, 1 at 2.2
    v.co.z = v.co.z - slope_factor * 0.25
    # Also narrow slightly at very front
    if v.co.y > 1.5:
        narrow_factor = (v.co.y - 1.5) / 0.7
        v.co.x = v.co.x * (1.0 - narrow_factor * 0.15)

# ─── REAR — Taper down at back ───
rear_verts = [v for v in body.data.vertices if v.co.y < -1.2]
for v in rear_verts:
    slope_factor = max(0, (-1.2 - v.co.y) / 1.0)
    v.co.z = v.co.z - slope_factor * 0.3
    # Narrow at very back
    if v.co.y < -1.5:
        narrow_factor = (-1.5 - v.co.y) / 0.7
        v.co.x = v.co.x * (1.0 - narrow_factor * 0.2)

# ─── CABIN ROOF — Raise center section ───
# Roof vertices: middle Y range, top Z
roof_verts = [v for v in body.data.vertices 
              if abs(v.co.y) < 0.8 and v.co.z > 0.2]
for v in roof_verts:
    # Raise roof in center
    center_factor = 1.0 - abs(v.co.y) / 0.8  # 1 at center, 0 at edges
    v.co.z = v.co.z + center_factor * 0.35
    # Taper roof at sides (cabin narrower than body)
    side_factor = abs(v.co.x) / 0.85
    if side_factor > 0.7:
        v.co.x = v.co.x * 0.9

# ─── WHEEL WELLS — Push vertices inward at wheel positions ───
# Front wheels at Y=1.0, Rear wheels at Y=-1.0
wheel_well_positions = [1.0, -1.0]
for wy in wheel_well_positions:
    well_verts = [v for v in body.data.vertices 
                  if abs(v.co.y - wy) < 0.35 and v.co.z < 0.1 and abs(v.co.x) > 0.6]
    for v in well_verts:
        # Push bottom vertices up (create arch)
        dist_from_well = abs(v.co.y - wy)
        arch_depth = max(0, 1.0 - dist_from_well / 0.35) * 0.25
        v.co.z = v.co.z + arch_depth
        # Push sides out slightly at wheel well
        side_push = max(0, 1.0 - dist_from_well / 0.35) * 0.08
        v.co.x = v.co.x + (1.0 if v.co.x > 0 else -1.0) * side_push

# ─── WINDSHIELD RAKE ───
# Vertices between hood and cabin (front glass area)
windshield_verts = [v for v in body.data.vertices 
                    if 0.3 < v.co.y < 1.1 and v.co.z > 0.1]
for v in windshield_verts:
    # Rake back: higher Z means more negative Y shift
    rake = max(0, (v.co.z - 0.1) / 0.6) * 0.4
    v.co.y = v.co.y - rake
    # Also slope the glass surface
    if v.co.z > 0.25:
        slope = (v.co.z - 0.25) / 0.5
        v.co.z = v.co.z - slope * 0.15

# ─── REAR WINDOW RAKE ───
rear_glass_verts = [v for v in body.data.vertices 
                    if -1.1 < v.co.y < -0.3 and v.co.z > 0.1]
for v in rear_glass_verts:
    rake = max(0, (v.co.z - 0.1) / 0.6) * 0.3
    v.co.y = v.co.y + rake

# Update mesh
body.data.update()

# Back to object mode
bpy.ops.object.mode_set(mode='OBJECT')

# ─── MODIFIERS ───
# Subdivision for smooth curves
sub = body.modifiers.new(name='Subdivision', type='SUBSURF')
sub.levels = 2
sub.render_levels = 3
sub.subdivision_type = 'CATMULL_CLARK'

# Bevel for rounded edges
bevel = body.modifiers.new(name='Bevel', type='BEVEL')
bevel.width = 0.03
bevel.segments = 3
bevel.limit_method = 'ANGLE'
bevel.angle_limit = math.radians(45)

# Mirror for symmetry (only model one side)
mirror = body.modifiers.new(name='Mirror', type='MIRROR')
mirror.use_axis = (True, False, False)  # Mirror on X
mirror.use_mirror_merge = True
mirror.merge_threshold = 0.01

set_material(body, mat_red)

# ─── WHEELS — Smaller, properly sized ───
wheel_y = 0.12  # Center height (touching ground)
wheel_positions = [
    (-0.82, 1.0, wheel_y),   # Front Left
    (0.82, 1.0, wheel_y),    # Front Right
    (-0.82, -1.0, wheel_y),  # Rear Left
    (0.82, -1.0, wheel_y),   # Rear Right
]

wheel_major = 0.10
wheel_minor = 0.055
rim_radius = 0.065
rim_depth = 0.04

for i, pos in enumerate(wheel_positions):
    # Tire
    bpy.ops.mesh.primitive_torus_add(major_radius=wheel_major, minor_radius=wheel_minor, location=pos)
    tire = bpy.context.active_object
    tire.name = f'Wheel_{i}'
    tire.rotation_euler = (0, math.radians(90), 0)
    set_material(tire, mat_tire)
    
    # Rim
    bpy.ops.mesh.primitive_cylinder_add(radius=rim_radius, depth=rim_depth, location=pos)
    rim = bpy.context.active_object
    rim.name = f'Rim_{i}'
    rim.rotation_euler = (0, math.radians(90), 0)
    set_material(rim, mat_rim)
    
    # Brake caliper
    caliper_x = pos[0] + (0.025 if pos[0] < 0 else -0.025)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(caliper_x, pos[1], pos[2] + 0.02))
    caliper = bpy.context.active_object
    caliper.name = f'Caliper_{i}'
    caliper.scale = (0.015, 0.04, 0.025)
    set_material(caliper, mat_red)

# ─── HEADLIGHTS — Recessed into body ───
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.45, 1.72, 0.22))
hl_L = bpy.context.active_object
hl_L.name = 'Headlight_L'
hl_L.scale = (0.22, 0.03, 0.12)
set_material(hl_L, mat_chrome)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.45, 1.72, 0.22))
hl_R = bpy.context.active_object
hl_R.name = 'Headlight_R'
hl_R.scale = (0.22, 0.03, 0.12)
set_material(hl_R, mat_chrome)

# LED strips
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.45, 1.74, 0.22))
led_L = bpy.context.active_object
led_L.name = 'HeadlightLED_L'
led_L.scale = (0.16, 0.005, 0.04)
set_material(led_L, mat_neon)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.45, 1.74, 0.22))
led_R = bpy.context.active_object
led_R.name = 'HeadlightLED_R'
led_R.scale = (0.16, 0.005, 0.04)
set_material(led_R, mat_neon)

# ─── TAILLIGHTS — Full width light bar ───
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -1.78, 0.25))
tl_bar = bpy.context.active_object
tl_bar.name = 'TaillightBar'
tl_bar.scale = (0.65, 0.02, 0.05)
set_material(tl_bar, mat_neon)

# ─── FRONT SPLITTER ───
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 1.85, 0.06))
splitter = bpy.context.active_object
splitter.name = 'FrontSplitter'
splitter.scale = (0.85, 0.04, 0.03)
set_material(splitter, mat_black)

# ─── SPOILER — Sleek wing ───
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -1.55, 0.52))
wing = bpy.context.active_object
wing.name = 'SpoilerWing'
wing.scale = (0.75, 0.1, 0.025)
set_material(wing, mat_black)

# Endplates
for x_sign in [-1, 1]:
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x_sign * 0.72, -1.55, 0.46))
    plate = bpy.context.active_object
    plate.name = f'SpoilerPlate_{"L" if x_sign < 0 else "R"}'
    plate.scale = (0.025, 0.12, 0.08)
    set_material(plate, mat_black)

# Struts
for x in [-0.35, 0.35]:
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, -1.48, 0.44))
    strut = bpy.context.active_object
    strut.name = f'SpoilerStrut_{"L" if x < 0 else "R"}'
    strut.scale = (0.03, 0.04, 0.06)
    set_material(strut, mat_black)

# ─── SIDE SKIRTS ───
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.92, 0, 0.08))
skirt_L = bpy.context.active_object
skirt_L.name = 'SideSkirt_L'
skirt_L.scale = (0.02, 1.6, 0.06)
set_material(skirt_L, mat_black)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.92, 0, 0.08))
skirt_R = bpy.context.active_object
skirt_R.name = 'SideSkirt_R'
skirt_R.scale = (0.02, 1.6, 0.06)
set_material(skirt_R, mat_black)

# ─── SIDE MIRRORS ───
for x_sign in [-1, 1]:
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x_sign * 0.98, 0.35, 0.48))
    mirror = bpy.context.active_object
    mirror.name = f'SideMirror_{"L" if x_sign < 0 else "R"}'
    mirror.scale = (0.05, 0.04, 0.025)
    set_material(mirror, mat_black)

# ─── UNDERGLOW ───
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.02))
underglow = bpy.context.active_object
underglow.name = 'Underglow'
underglow.scale = (0.8, 1.7, 0.005)
set_material(underglow, mat_neon)

# ─── EXHAUST ───
for x in [-0.3, 0.3]:
    bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.18, location=(x, -1.82, 0.12))
    exhaust = bpy.context.active_object
    exhaust.name = f'Exhaust_{"L" if x < 0 else "R"}'
    exhaust.rotation_euler = (math.radians(90), 0, 0)
    set_material(exhaust, mat_chrome)

# ─── MASCOT HEAD — Angry hood ornament ───
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.14, segments=20, ring_count=14, location=(0, 1.35, 0.52))
mascot = bpy.context.active_object
mascot.name = 'MascotHead'
set_material(mascot, mat_red)

# Eyes
for x_sign in [-1, 1]:
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.04, segments=10, ring_count=6, location=(x_sign * 0.05, 1.42, 0.56))
    eye = bpy.context.active_object
    eye.name = f'MascotEye_{"L" if x_sign < 0 else "R"}'
    eye.scale = (1.0, 0.7, 0.6)
    set_material(eye, create_mat('White', (1.0, 1.0, 1.0), roughness=0.1))

    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.02, segments=8, ring_count=5, location=(x_sign * 0.05, 1.44, 0.56))
    pupil = bpy.context.active_object
    pupil.name = f'MascotPupil_{"L" if x_sign < 0 else "R"}'
    set_material(pupil, mat_black)

# Angry brows
for x_sign in [-1, 1]:
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x_sign * 0.07, 1.38, 0.62))
    brow = bpy.context.active_object
    brow.name = f'MascotBrow_{"L" if x_sign < 0 else "R"}'
    brow.scale = (0.07, 0.02, 0.01)
    brow.rotation_euler = (0.3, 0, x_sign * 0.5)
    set_material(brow, mat_black)

# ─── TRACK — Flat circular ───
track_radius = 4.0
track_width = 1.4

bpy.ops.mesh.primitive_torus_add(major_radius=track_radius, minor_radius=track_width/2, location=(0, 0, 0))
road = bpy.context.active_object
road.name = 'TrackRoad'
road.scale = (1.0, 1.0, 0.06)
set_material(road, mat_road)

bpy.ops.mesh.primitive_torus_add(major_radius=track_radius, minor_radius=0.015, location=(0, 0, 0.01))
center = bpy.context.active_object
center.name = 'TrackCenterLine'
center.scale = (1.0, 1.0, 0.06)
set_material(center, mat_road_line)

bpy.ops.mesh.primitive_torus_add(major_radius=track_radius - track_width/2 - 0.05, minor_radius=0.025, location=(0, 0, 0.03))
edge_inner = bpy.context.active_object
edge_inner.name = 'TrackEdgeInner'
edge_inner.scale = (1.0, 1.0, 0.06)
set_material(edge_inner, mat_neon)

bpy.ops.mesh.primitive_torus_add(major_radius=track_radius + track_width/2 + 0.05, minor_radius=0.025, location=(0, 0, 0.03))
edge_outer = bpy.context.active_object
edge_outer.name = 'TrackEdgeOuter'
edge_outer.scale = (1.0, 1.0, 0.06)
set_material(edge_outer, mat_neon)

# Track posts
for i in range(10):
    angle = (i / 10) * 2 * math.pi
    r = track_radius + track_width/2 + 0.3
    x, y = math.cos(angle) * r, math.sin(angle) * r
    
    bpy.ops.mesh.primitive_cylinder_add(radius=0.02, depth=0.4, location=(x, y, 0.2))
    post = bpy.context.active_object
    post.name = f'TrackPost_{i}'
    set_material(post, mat_black)
    
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.045, segments=8, ring_count=6, location=(x, y, 0.42))
    light = bpy.context.active_object
    light.name = f'TrackLight_{i}'
    set_material(light, mat_neon)

# ─── PARENT ───
bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
root = bpy.context.active_object
root.name = '$MAD_Car'

for obj in bpy.context.scene.objects:
    if obj.type == 'MESH' and obj.name.startswith('Track'):
        continue
    if obj != root and obj.type == 'MESH':
        obj.parent = root

bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
track_root = bpy.context.active_object
track_root.name = '$MAD_Track'

for obj in bpy.context.scene.objects:
    if obj.type == 'MESH' and obj.name.startswith('Track'):
        obj.parent = track_root

# ─── LIGHTING ───
bpy.ops.object.light_add(type='SUN', location=(4, 3, 8))
key = bpy.context.active_object
key.data.energy = 5.0

bpy.ops.object.light_add(type='AREA', location=(-3, 2, 4))
fill = bpy.context.active_object
fill.data.energy = 2.5
fill.data.size = 3.0

bpy.ops.object.light_add(type='SPOT', location=(0, -4, 3))
rim = bpy.context.active_object
rim.data.energy = 6.0
rim.data.color = (1.0, 0.15, 0.15)
rim.data.spot_size = 1.2

# ─── EXPORT ───
output = '/tmp/mad_car_v3.glb'

bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(
    filepath=output,
    export_format='GLB',
    export_materials='EXPORT',
    export_image_format='WEBP',
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
    export_yup=True,
    export_tangents=False,
    export_cameras=False,
    export_lights=False,
)

print(f"✅ MAD Car v3: {output}")
print(f"📦 Size: {os.path.getsize(output) / 1024:.1f} KB")
print(f"📊 Meshes: {len([o for o in bpy.context.scene.objects if o.type == 'MESH'])}")
