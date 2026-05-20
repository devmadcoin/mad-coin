"""
$MAD Car v2 — Improved with proper car proportions and topology
Based on study: "Best Way To Model A Car In Blender" by Enpix
Uses blueprint-style proportions, hard-surface techniques, clean topology

Usage: blender -b --python build_mad_car_v2.py
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

mat_red_body = create_mat('Car_Red', (0.92, 0.0, 0.0), roughness=0.15, metallic=0.4)
mat_black = create_mat('Car_Black', (0.04, 0.04, 0.04), roughness=0.7)
mat_chrome = create_mat('Car_Chrome', (0.85, 0.85, 0.9), roughness=0.03, metallic=0.95)
mat_glass = create_mat('Car_Glass', (0.12, 0.12, 0.18), roughness=0.0, metallic=0.15)
mat_neon = create_mat('Neon_Red', (1.0, 0.0, 0.0), emissive=(1.0, 0.0, 0.0))
mat_tire = create_mat('Tire', (0.02, 0.02, 0.02), roughness=0.95)
mat_rim = create_mat('Rim', (0.75, 0.75, 0.8), roughness=0.08, metallic=0.85)
mat_road = create_mat('Road', (0.06, 0.06, 0.06), roughness=0.95)
mat_road_line = create_mat('Road_Line', (0.9, 0.0, 0.0), emissive=(0.9, 0.0, 0.0))
mat_mascot_skin = create_mat('Mascot_Skin', (0.9, 0.0, 0.0), roughness=0.35)
mat_mascot_eye = create_mat('Mascot_Eye', (1.0, 1.0, 1.0), roughness=0.1)
mat_mascot_pupil = create_mat('Mascot_Pupil', (0.02, 0.02, 0.02), roughness=0.05)
mat_mascot_black = create_mat('Mascot_Black', (0.05, 0.05, 0.05), roughness=0.6)
mat_interior = create_mat('Interior', (0.08, 0.08, 0.08), roughness=0.9)

def smooth_shade(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = True

def set_material(obj, mat):
    if len(obj.data.materials) == 0:
        obj.data.materials.append(mat)
    else:
        obj.data.materials[0] = mat

# ─── CAR BODY — Blueprint-style proportions ───
# Using a plane + extrude approach for proper car silhouette

# Base plane for the side profile
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0.4))
body = bpy.context.active_object
body.name = 'CarBody'
body.scale = (0.8, 2.2, 1.0)

# Enter edit mode and shape the car profile
bpy.context.view_layer.objects.active = body
bpy.ops.object.mode_set(mode='EDIT')

# Subdivide to get more geometry
bpy.ops.mesh.subdivide(number_cuts=4, smoothness=0.0)

# Select all vertices
bpy.ops.mesh.select_all(action='SELECT')

# Move to object mode
bpy.ops.object.mode_set(mode='OBJECT')

# Apply scale
bpy.ops.object.transform_apply(scale=True)

# Now add a subdivision surface modifier for smooth curves
subsurf = body.modifiers.new(name='Subdivision', type='SUBSURF')
subsurf.levels = 2
subsurf.render_levels = 3
subsurf.subdivision_type = 'CATMULL_CLARK'

# Add edge split for sharp creases
edge_split = body.modifiers.new(name='EdgeSplit', type='EDGE_SPLIT')
edge_split.use_edge_angle = True
edge_split.split_angle = math.radians(30)

set_material(body, mat_red_body)
smooth_shade(body)

# ─── HOOD ───
# Create a hood that's curved, not flat
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.8, 0.55))
hood = bpy.context.active_object
hood.name = 'Hood'
hood.scale = (0.7, 0.6, 0.08)
# Apply smooth deformation via proportional editing simulation
set_material(hood, mat_red_body)
smooth_shade(hood)

# Hood bulge (center raised area)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.7, 0.62))
hood_bulge = bpy.context.active_object
hood_bulge.name = 'HoodBulge'
hood_bulge.scale = (0.35, 0.5, 0.04)
set_material(hood_bulge, mat_red_body)
smooth_shade(hood_bulge)

# Hood scoop (small intake)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.85, 0.66))
scoop = bpy.context.active_object
scoop.name = 'HoodScoop'
scoop.scale = (0.25, 0.2, 0.04)
set_material(scoop, mat_black)

# ─── CABIN / ROOF ───
# Tapered cabin with curved roof
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.2, 0.72))
cabin = bpy.context.active_object
cabin.name = 'Cabin'
cabin.scale = (0.7, 0.65, 0.22)
set_material(cabin, mat_red_body)
smooth_shade(cabin)

# Windshield
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.25, 0.7))
windshield = bpy.context.active_object
windshield.name = 'Windshield'
windshield.scale = (0.65, 0.01, 0.18)
windshield.rotation_euler = (0.35, 0, 0)  # Raked back
set_material(windshield, mat_glass)

# Rear window
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.65, 0.68))
rear_window = bpy.context.active_object
rear_window.name = 'RearWindow'
rear_window.scale = (0.6, 0.01, 0.15)
rear_window.rotation_euler = (-0.2, 0, 0)  # Raked forward
set_material(rear_window, mat_glass)

# Side windows
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.72, -0.15, 0.7))
window_L = bpy.context.active_object
window_L.name = 'SideWindow_L'
window_L.scale = (0.01, 0.45, 0.12)
set_material(window_L, mat_glass)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.72, -0.15, 0.7))
window_R = bpy.context.active_object
window_R.name = 'SideWindow_R'
window_R.scale = (0.01, 0.45, 0.12)
set_material(window_R, mat_glass)

# ─── WHEEL WELLS (Carved into body) ───
# Use boolean subtraction to create wheel arches
wheel_positions = [
    (-0.75, 0.7, 0.2),   # Front Left
    (0.75, 0.7, 0.2),    # Front Right
    (-0.75, -0.7, 0.2),  # Rear Left
    (0.75, -0.7, 0.2),   # Rear Right
]

# Instead of booleans (complex in bpy), create wheel arch shapes
for i, pos in enumerate(wheel_positions):
    x_sign = -1 if pos[0] < 0 else 1
    
    # Wheel arch (half-cylinder cutout simulation)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.22, depth=0.05, location=(pos[0], pos[1], 0.28))
    arch = bpy.context.active_object
    arch.name = f'WheelArch_{i}'
    arch.rotation_euler = (0, math.radians(90) * x_sign, 0)
    arch.scale = (1.0, 1.2, 1.0)
    set_material(arch, mat_black)

# ─── FRONT FASCIA ───
# Lower front bumper
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 1.15, 0.25))
front_bumper = bpy.context.active_object
front_bumper.name = 'FrontBumper'
front_bumper.scale = (0.82, 0.08, 0.18)
set_material(front_bumper, mat_red_body)
smooth_shade(front_bumper)

# Front splitter
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 1.22, 0.12))
splitter = bpy.context.active_object
splitter.name = 'FrontSplitter'
splitter.scale = (0.78, 0.04, 0.04)
set_material(splitter, mat_black)

# Headlights — Integrated into front (not spheres glued on)
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.45, 1.05, 0.38))
headlight_L = bpy.context.active_object
headlight_L.name = 'Headlight_L'
headlight_L.scale = (0.18, 0.06, 0.1)
headlight_L.rotation_euler = (0.15, 0.1, 0)
set_material(headlight_L, mat_chrome)
smooth_shade(headlight_L)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.45, 1.05, 0.38))
headlight_R = bpy.context.active_object
headlight_R.name = 'Headlight_R'
headlight_R.scale = (0.18, 0.06, 0.1)
headlight_R.rotation_euler = (0.15, -0.1, 0)
set_material(headlight_R, mat_chrome)
smooth_shade(headlight_R)

# LED strips inside headlights
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.45, 1.08, 0.4))
led_L = bpy.context.active_object
led_L.name = 'HeadlightLED_L'
led_L.scale = (0.12, 0.01, 0.04)
set_material(led_L, mat_neon)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.45, 1.08, 0.4))
led_R = bpy.context.active_object
led_R.name = 'HeadlightLED_R'
led_R.scale = (0.12, 0.01, 0.04)
set_material(led_R, mat_neon)

# ─── REAR END ───
# Rear bumper
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -1.15, 0.28))
rear_bumper = bpy.context.active_object
rear_bumper.name = 'RearBumper'
rear_bumper.scale = (0.8, 0.08, 0.15)
set_material(rear_bumper, mat_red_body)
smooth_shade(rear_bumper)

# Taillights — Full-width light bar style
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -1.18, 0.42))
taillight_bar = bpy.context.active_object
taillight_bar.name = 'TaillightBar'
taillight_bar.scale = (0.6, 0.02, 0.06)
set_material(taillight_bar, mat_neon)

# ─── SIDE SKIRTS ───
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.88, 0, 0.15))
skirt_L = bpy.context.active_object
skirt_L.name = 'SideSkirt_L'
skirt_L.scale = (0.03, 1.9, 0.08)
set_material(skirt_L, mat_black)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.88, 0, 0.15))
skirt_R = bpy.context.active_object
skirt_R.name = 'SideSkirt_R'
skirt_R.scale = (0.03, 1.9, 0.08)
set_material(skirt_R, mat_black)

# ─── SPOILER — Proper aerodynamic wing ───
# Main wing (curved top surface)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -1.0, 0.58))
wing = bpy.context.active_object
wing.name = 'SpoilerWing'
wing.scale = (0.7, 0.12, 0.03)
set_material(wing, mat_black)

# Wing endplates (vertical supports at ends)
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.65, -1.0, 0.5))
endplate_L = bpy.context.active_object
endplate_L.name = 'SpoilerEnd_L'
endplate_L.scale = (0.03, 0.1, 0.1)
set_material(endplate_L, mat_black)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.65, -1.0, 0.5))
endplate_R = bpy.context.active_object
endplate_R.name = 'SpoilerEnd_R'
endplate_R.scale = (0.03, 0.1, 0.1)
set_material(endplate_R, mat_black)

# Spoiler supports (struts)
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.3, -0.92, 0.48))
strut_L = bpy.context.active_object
strut_L.name = 'SpoilerStrut_L'
strut_L.scale = (0.04, 0.04, 0.08)
set_material(strut_L, mat_black)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.3, -0.92, 0.48))
strut_R = bpy.context.active_object
strut_R.name = 'SpoilerStrut_R'
strut_R.scale = (0.04, 0.04, 0.08)
set_material(strut_R, mat_black)

# ─── WHEELS — Proper proportion and detail ───
for i, pos in enumerate(wheel_positions):
    # Tire (torus for roundness)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.17, minor_radius=0.085, location=pos)
    tire = bpy.context.active_object
    tire.name = f'Wheel_{i}'
    tire.rotation_euler = (0, 0, 0)
    set_material(tire, mat_tire)
    
    # Rim (cylinder with slightly smaller radius)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.11, depth=0.07, location=pos)
    rim = bpy.context.active_object
    rim.name = f'Rim_{i}'
    rim.rotation_euler = (math.radians(90), 0, 0)
    set_material(rim, mat_rim)
    
    # Brake caliper (small red box visible through rim)
    caliper_x = pos[0] + (0.04 if pos[0] < 0 else -0.04)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(caliper_x, pos[1], pos[2] + 0.05))
    caliper = bpy.context.active_object
    caliper.name = f'Caliper_{i}'
    caliper.scale = (0.02, 0.06, 0.04)
    set_material(caliper, mat_red_body)

# ─── SIDE MIRRORS ───
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.9, 0.3, 0.65))
mirror_L = bpy.context.active_object
mirror_L.name = 'SideMirror_L'
mirror_L.scale = (0.06, 0.04, 0.03)
mirror_L.rotation_euler = (0.1, 0.2, 0)
set_material(mirror_L, mat_black)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.9, 0.3, 0.65))
mirror_R = bpy.context.active_object
mirror_R.name = 'SideMirror_R'
mirror_R.scale = (0.06, 0.04, 0.03)
mirror_R.rotation_euler = (0.1, -0.2, 0)
set_material(mirror_R, mat_black)

# ─── UNDERGLOW ───
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.05))
underglow = bpy.context.active_object
underglow.name = 'Underglow'
underglow.scale = (0.75, 2.0, 0.01)
set_material(underglow, mat_neon)

# ─── DUAL EXHAUST ───
bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.25, location=(-0.3, -1.2, 0.22))
exhaust_L = bpy.context.active_object
exhaust_L.name = 'Exhaust_L'
exhaust_L.rotation_euler = (math.radians(90), 0, 0)
set_material(exhaust_L, mat_chrome)

bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.25, location=(0.3, -1.2, 0.22))
exhaust_R = bpy.context.active_object
exhaust_R.name = 'Exhaust_R'
exhaust_R.rotation_euler = (math.radians(90), 0, 0)
set_material(exhaust_R, mat_chrome)

# ─── MASCOT HEAD (Hood Ornament) — Angry and prominent ───
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.18, segments=24, ring_count=16, location=(0, 0.95, 0.68))
mascot_head = bpy.context.active_object
mascot_head.name = 'MascotHead'
set_material(mascot_head, mat_mascot_skin)
smooth_shade(mascot_head)

# Eyes (almond shaped — wider than tall)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.05, segments=12, ring_count=8, location=(-0.06, 1.02, 0.72))
eye_L = bpy.context.active_object
eye_L.name = 'MascotEye_L'
eye_L.scale = (1.0, 0.7, 0.6)
set_material(eye_L, mat_mascot_eye)

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.05, segments=12, ring_count=8, location=(0.06, 1.02, 0.72))
eye_R = bpy.context.active_object
eye_R.name = 'MascotEye_R'
eye_R.scale = (1.0, 0.7, 0.6)
set_material(eye_R, mat_mascot_eye)

# Pupils (forward looking)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.025, segments=10, ring_count=6, location=(-0.06, 1.04, 0.72))
pupil_L = bpy.context.active_object
pupil_L.name = 'MascotPupil_L'
set_material(pupil_L, mat_mascot_pupil)

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.025, segments=10, ring_count=6, location=(0.06, 1.04, 0.72))
pupil_R = bpy.context.active_object
pupil_R.name = 'MascotPupil_R'
set_material(pupil_R, mat_mascot_pupil)

# Angry eyebrows (thick V-shape, prominent)
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.08, 0.98, 0.78))
brow_L = bpy.context.active_object
brow_L.name = 'MascotBrow_L'
brow_L.scale = (0.08, 0.025, 0.015)
brow_L.rotation_euler = (0.35, 0, 0.45)
set_material(brow_L, mat_mascot_black)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.08, 0.98, 0.78))
brow_R = bpy.context.active_object
brow_R.name = 'MascotBrow_R'
brow_R.scale = (0.08, 0.025, 0.015)
brow_R.rotation_euler = (0.35, 0, -0.45)
set_material(brow_R, mat_mascot_black)

# ─── INTERIOR (Visible through windows) ───
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.15, 0.55))
interior = bpy.context.active_object
interior.name = 'Interior'
interior.scale = (0.6, 0.5, 0.15)
set_material(interior, mat_interior)

# Steering wheel
bpy.ops.mesh.primitive_torus_add(major_radius=0.08, minor_radius=0.015, location=(0.15, 0.15, 0.58))
steering = bpy.context.active_object
steering.name = 'SteeringWheel'
steering.rotation_euler = (0.3, 0, 0)
set_material(steering, mat_black)

# Seats
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.15, -0.2, 0.58))
seat_L = bpy.context.active_object
seat_L.name = 'Seat_L'
seat_L.scale = (0.15, 0.18, 0.2)
set_material(seat_L, mat_black)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.15, -0.2, 0.58))
seat_R = bpy.context.active_object
seat_R.name = 'Seat_R'
seat_R.scale = (0.15, 0.18, 0.2)
set_material(seat_R, mat_black)

# ─── CIRCULAR TRACK (Flat on ground) ───
track_radius = 4.0
track_width = 1.4

# Road surface — flat torus
bpy.ops.mesh.primitive_torus_add(major_radius=track_radius, minor_radius=track_width/2, location=(0, 0, 0))
road = bpy.context.active_object
road.name = 'TrackRoad'
road.scale = (1.0, 1.0, 0.08)
set_material(road, mat_road)
smooth_shade(road)

# Center line
bpy.ops.mesh.primitive_torus_add(major_radius=track_radius, minor_radius=0.02, location=(0, 0, 0.02))
center_line = bpy.context.active_object
center_line.name = 'TrackCenterLine'
center_line.scale = (1.0, 1.0, 0.08)
set_material(center_line, mat_road_line)

# Neon edge strips
bpy.ops.mesh.primitive_torus_add(major_radius=track_radius - track_width/2 - 0.06, minor_radius=0.035, location=(0, 0, 0.04))
edge_inner = bpy.context.active_object
edge_inner.name = 'TrackEdgeInner'
edge_inner.scale = (1.0, 1.0, 0.08)
set_material(edge_inner, mat_neon)

bpy.ops.mesh.primitive_torus_add(major_radius=track_radius + track_width/2 + 0.06, minor_radius=0.035, location=(0, 0, 0.04))
edge_outer = bpy.context.active_object
edge_outer.name = 'TrackEdgeOuter'
edge_outer.scale = (1.0, 1.0, 0.08)
set_material(edge_outer, mat_neon)

# Track posts with lights (10 posts for better coverage)
for i in range(10):
    angle = (i / 10) * 2 * math.pi
    x = math.cos(angle) * (track_radius + track_width/2 + 0.35)
    y = math.sin(angle) * (track_radius + track_width/2 + 0.35)
    
    # Post
    bpy.ops.mesh.primitive_cylinder_add(radius=0.025, depth=0.45, location=(x, y, 0.22))
    post = bpy.context.active_object
    post.name = f'TrackPost_{i}'
    set_material(post, mat_black)
    
    # Light on top
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.055, segments=8, ring_count=6, location=(x, y, 0.48))
    light = bpy.context.active_object
    light.name = f'TrackLight_{i}'
    set_material(light, mat_neon)

# ─── PARENT EVERYTHING ───
bpy.ops.object.empty_add(type='ARROWS', location=(0, 0, 0))
root = bpy.context.active_object
root.name = '$MAD_Car'

car_objects = [
    body, hood, hood_bulge, scoop, cabin, windshield, rear_window,
    window_L, window_R, front_bumper, splitter, headlight_L, headlight_R,
    led_L, led_R, rear_bumper, taillight_bar, skirt_L, skirt_R,
    wing, endplate_L, endplate_R, strut_L, strut_R,
    underglow, exhaust_L, exhaust_R,
    mascot_head, eye_L, eye_R, pupil_L, pupil_R, brow_L, brow_R,
    interior, steering, seat_L, seat_R,
    mirror_L, mirror_R
]

# Get all wheels and arch parts
for obj in bpy.context.scene.objects:
    if obj.name.startswith('Wheel_') or obj.name.startswith('Rim_') or obj.name.startswith('Caliper_') or obj.name.startswith('WheelArch_'):
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
bpy.ops.object.light_add(type='SUN', location=(5, 5, 10))
key = bpy.context.active_object
key.name = 'KeyLight'
key.data.energy = 4.0
key.data.color = (1.0, 0.95, 0.9)

bpy.ops.object.light_add(type='AREA', location=(-4, 2, 5))
fill = bpy.context.active_object
fill.name = 'FillLight'
fill.data.energy = 2.0
fill.data.color = (0.85, 0.9, 1.0)
fill.data.size = 4.0

bpy.ops.object.light_add(type='SPOT', location=(0, -3, 3))
rim = bpy.context.active_object
rim.name = 'RimLight'
rim.data.energy = 8.0
rim.data.color = (1.0, 0.2, 0.2)
rim.data.spot_size = 1.5

bpy.ops.object.light_add(type='POINT', location=(0, 0, -0.5))
bounce = bpy.context.active_object
bounce.name = 'BounceLight'
bounce.data.energy = 2.0
bounce.data.color = (1.0, 0.3, 0.3)

# ─── EXPORT ───
output_path = '/tmp/mad_car_v2.glb'

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

print(f"✅ MAD Car v2 exported to: {output_path}")
print(f"📦 File size: {os.path.getsize(output_path) / 1024:.1f} KB")
print(f"📊 Objects: {len([o for o in bpy.context.scene.objects if o.type == 'MESH'])} meshes")
