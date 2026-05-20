"""
$MAD Car v4 — MAD Chao Character DRIVES the car
Full character with arms, hands on steering wheel, head tracking
"""

import bpy
import math
import os

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

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

def smooth_shade(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = True

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
mat_skin = create_mat('Mascot_Skin', (0.9, 0.0, 0.0), roughness=0.35)
mat_white = create_mat('White', (1.0, 1.0, 1.0), roughness=0.1)

# ═══════════════════════════════════════════════════════
#  CAR BODY — Unified from v3
# ═══════════════════════════════════════════════════════

bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
body = bpy.context.active_object
body.name = 'CarBody'
body.scale = (1.7, 3.6, 0.7)
bpy.ops.object.transform_apply(scale=True)

bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.subdivide(number_cuts=6, smoothness=0.0)
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.subdivide(number_cuts=2, smoothness=0.0)
bpy.ops.object.mode_set(mode='OBJECT')

# Shape vertices
for v in body.data.vertices:
    # Hood slope (front taper down)
    if v.co.y > 1.2:
        sf = max(0, (v.co.y - 1.2) / 1.0)
        v.co.z -= sf * 0.25
        if v.co.y > 1.5:
            nf = (v.co.y - 1.5) / 0.7
            v.co.x *= (1.0 - nf * 0.15)
    # Rear taper
    if v.co.y < -1.2:
        sf = max(0, (-1.2 - v.co.y) / 1.0)
        v.co.z -= sf * 0.3
        if v.co.y < -1.5:
            nf = (-1.5 - v.co.y) / 0.7
            v.co.x *= (1.0 - nf * 0.2)
    # Cabin roof raise
    if abs(v.co.y) < 0.8 and v.co.z > 0.2:
        cf = 1.0 - abs(v.co.y) / 0.8
        v.co.z += cf * 0.35
        sf = abs(v.co.x) / 0.85
        if sf > 0.7:
            v.co.x *= 0.9
    # Wheel wells
    for wy in [1.0, -1.0]:
        if abs(v.co.y - wy) < 0.35 and v.co.z < 0.1 and abs(v.co.x) > 0.6:
            df = abs(v.co.y - wy)
            arch = max(0, 1.0 - df / 0.35) * 0.25
            v.co.z += arch
            side = max(0, 1.0 - df / 0.35) * 0.08
            v.co.x += (1.0 if v.co.x > 0 else -1.0) * side
    # Windshield rake
    if 0.3 < v.co.y < 1.1 and v.co.z > 0.1:
        rake = max(0, (v.co.z - 0.1) / 0.6) * 0.4
        v.co.y -= rake
        if v.co.z > 0.25:
            slope = (v.co.z - 0.25) / 0.5
            v.co.z -= slope * 0.15
    # Rear window rake
    if -1.1 < v.co.y < -0.3 and v.co.z > 0.1:
        rake = max(0, (v.co.z - 0.1) / 0.6) * 0.3
        v.co.y += rake

body.data.update()

sub = body.modifiers.new(name='Subdivision', type='SUBSURF')
sub.levels = 2
sub.render_levels = 3
sub.subdivision_type = 'CATMULL_CLARK'

bevel = body.modifiers.new(name='Bevel', type='BEVEL')
bevel.width = 0.03
bevel.segments = 3
bevel.limit_method = 'ANGLE'
bevel.angle_limit = math.radians(45)

mirror = body.modifiers.new(name='Mirror', type='MIRROR')
mirror.use_axis = (True, False, False)
mirror.use_mirror_merge = True
mirror.merge_threshold = 0.01

set_material(body, mat_red)
smooth_shade(body)

# ═══════════════════════════════════════════════════════
#  WHEELS — Protruding clearly from body
# ═══════════════════════════════════════════════════════
wheel_y = 0.10  # Lower so they hang down
wheel_positions = [(-0.95, 1.0, wheel_y), (0.95, 1.0, wheel_y),
                   (-0.95, -1.0, wheel_y), (0.95, -1.0, wheel_y)]

for i, pos in enumerate(wheel_positions):
    # Tire — larger and more visible
    bpy.ops.mesh.primitive_torus_add(major_radius=0.14, minor_radius=0.075, location=pos)
    tire = bpy.context.active_object
    tire.name = f'Wheel_{i}'
    tire.rotation_euler = (0, math.radians(90), 0)
    set_material(tire, mat_tire)
    
    # Rim
    bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=0.05, location=pos)
    rim = bpy.context.active_object
    rim.name = f'Rim_{i}'
    rim.rotation_euler = (0, math.radians(90), 0)
    set_material(rim, mat_rim)
    
    # Brake caliper
    cx = pos[0] + (0.03 if pos[0] < 0 else -0.03)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(cx, pos[1], pos[2] + 0.03))
    caliper = bpy.context.active_object
    caliper.name = f'Caliper_{i}'
    caliper.scale = (0.02, 0.05, 0.03)
    set_material(caliper, mat_red)

# ═══════════════════════════════════════════════════════
#  CAR DETAILS
# ═══════════════════════════════════════════════════════

# Headlights
for x in [-0.45, 0.45]:
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, 1.72, 0.22))
    hl = bpy.context.active_object
    hl.name = f'Headlight_{"L" if x < 0 else "R"}'
    hl.scale = (0.22, 0.03, 0.12)
    set_material(hl, mat_chrome)
    
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, 1.74, 0.22))
    led = bpy.context.active_object
    led.name = f'HeadlightLED_{"L" if x < 0 else "R"}'
    led.scale = (0.16, 0.005, 0.04)
    set_material(led, mat_neon)

# Taillights
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -1.78, 0.25))
tl = bpy.context.active_object
tl.name = 'TaillightBar'
tl.scale = (0.65, 0.02, 0.05)
set_material(tl, mat_neon)

# Splitter
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 1.85, 0.06))
splitter = bpy.context.active_object
splitter.name = 'FrontSplitter'
splitter.scale = (0.85, 0.04, 0.03)
set_material(splitter, mat_black)

# Spoiler
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -1.55, 0.52))
wing = bpy.context.active_object
wing.name = 'SpoilerWing'
wing.scale = (0.75, 0.1, 0.025)
set_material(wing, mat_black)

for x_sign in [-1, 1]:
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x_sign * 0.72, -1.55, 0.46))
    plate = bpy.context.active_object
    plate.name = f'SpoilerPlate_{"L" if x_sign < 0 else "R"}'
    plate.scale = (0.025, 0.12, 0.08)
    set_material(plate, mat_black)

for x in [-0.35, 0.35]:
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, -1.48, 0.44))
    strut = bpy.context.active_object
    strut.name = f'SpoilerStrut_{"L" if x < 0 else "R"}'
    strut.scale = (0.03, 0.04, 0.06)
    set_material(strut, mat_black)

# Side skirts
for x in [-0.92, 0.92]:
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, 0, 0.08))
    skirt = bpy.context.active_object
    skirt.name = f'SideSkirt_{"L" if x < 0 else "R"}'
    skirt.scale = (0.02, 1.6, 0.06)
    set_material(skirt, mat_black)

# Side mirrors
for x_sign in [-1, 1]:
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x_sign * 0.98, 0.35, 0.48))
    mirror = bpy.context.active_object
    mirror.name = f'SideMirror_{"L" if x_sign < 0 else "R"}'
    mirror.scale = (0.05, 0.04, 0.025)
    set_material(mirror, mat_black)

# Underglow
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.02))
underglow = bpy.context.active_object
underglow.name = 'Underglow'
underglow.scale = (0.8, 1.7, 0.005)
set_material(underglow, mat_neon)

# Exhaust
for x in [-0.3, 0.3]:
    bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.18, location=(x, -1.82, 0.12))
    exhaust = bpy.context.active_object
    exhaust.name = f'Exhaust_{"L" if x < 0 else "R"}'
    exhaust.rotation_euler = (math.radians(90), 0, 0)
    set_material(exhaust, mat_chrome)

# Windows
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.25, 0.7))
windshield = bpy.context.active_object
windshield.name = 'Windshield'
windshield.scale = (0.65, 0.01, 0.18)
windshield.rotation_euler = (0.35, 0, 0)
set_material(windshield, mat_glass)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.65, 0.68))
rw = bpy.context.active_object
rw.name = 'RearWindow'
rw.scale = (0.6, 0.01, 0.15)
rw.rotation_euler = (-0.2, 0, 0)
set_material(rw, mat_glass)

for x in [-0.72, 0.72]:
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, -0.15, 0.7))
    sw = bpy.context.active_object
    sw.name = f'SideWindow_{"L" if x < 0 else "R"}'
    sw.scale = (0.01, 0.45, 0.12)
    set_material(sw, mat_glass)

# ═══════════════════════════════════════════════════════
#  INTERIOR — Seat + Steering Wheel for character
# ═══════════════════════════════════════════════════════

# Driver's seat (right side, since steering wheel is on right)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0.22, -0.15, 0.45))
seat = bpy.context.active_object
seat.name = 'DriverSeat'
seat.scale = (0.2, 0.22, 0.18)
set_material(seat, mat_black)

# Seat back
bpy.ops.mesh.primitive_cube_add(size=1, location=(0.22, -0.28, 0.58))
seat_back = bpy.context.active_object
seat_back.name = 'SeatBack'
seat_back.scale = (0.2, 0.04, 0.22)
seat_back.rotation_euler = (-0.15, 0, 0)
set_material(seat_back, mat_black)

# Seat headrest
bpy.ops.mesh.primitive_cube_add(size=1, location=(0.22, -0.32, 0.74))
headrest = bpy.context.active_object
headrest.name = 'SeatHeadrest'
headrest.scale = (0.12, 0.03, 0.08)
set_material(headrest, mat_black)

# Steering wheel (right side)
bpy.ops.mesh.primitive_torus_add(major_radius=0.07, minor_radius=0.012, location=(-0.18, 0.12, 0.52))
steering_wheel = bpy.context.active_object
steering_wheel.name = 'SteeringWheel'
steering_wheel.rotation_euler = (0.4, 0, 0)
set_material(steering_wheel, mat_black)

# Steering column
bpy.ops.mesh.primitive_cylinder_add(radius=0.015, depth=0.2, location=(-0.18, 0.18, 0.42))
steering_col = bpy.context.active_object
steering_col.name = 'SteeringColumn'
steering_col.rotation_euler = (0.4, 0, 0)
set_material(steering_col, mat_black)

# Dashboard
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.35, 0.5))
dash = bpy.context.active_object
dash.name = 'Dashboard'
dash.scale = (0.8, 0.15, 0.08)
dash.rotation_euler = (0.1, 0, 0)
set_material(dash, mat_interior)

# ═══════════════════════════════════════════════════════
#  MAD CHAO CHARACTER — Driver
# ═══════════════════════════════════════════════════════

# Character position: sitting in driver's seat
char_x = 0.22
char_y = -0.15
char_z = 0.58

# Character body (rounded torso, sitting)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.14, segments=16, ring_count=12, location=(char_x, char_y, char_z))
char_body = bpy.context.active_object
char_body.name = 'ChaoBody'
char_body.scale = (1.0, 0.85, 1.2)  # Elongated vertically for sitting posture
set_material(char_body, mat_skin)
smooth_shade(char_body)

# Character head (larger sphere on top)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.11, segments=20, ring_count=16, location=(char_x, char_y - 0.02, char_z + 0.24))
char_head = bpy.context.active_object
char_head.name = 'ChaoHead'
set_material(char_head, mat_skin)
smooth_shade(char_head)

# Eyes (almond shaped)
for x_sign in [-1, 1]:
    # Eye whites
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.035, segments=12, ring_count=8, 
                                          location=(char_x + x_sign * 0.045, char_y + 0.06, char_z + 0.26))
    eye = bpy.context.active_object
    eye.name = f'ChaoEye_{"L" if x_sign < 0 else "R"}'
    eye.scale = (0.8, 0.6, 0.5)
    set_material(eye, mat_white)
    
    # Pupils
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.018, segments=8, ring_count=6,
                                          location=(char_x + x_sign * 0.045, char_y + 0.07, char_z + 0.26))
    pupil = bpy.context.active_object
    pupil.name = f'ChaoPupil_{"L" if x_sign < 0 else "R"}'
    set_material(pupil, mat_black)

# Angry eyebrows (thick, prominent)
for x_sign in [-1, 1]:
    bpy.ops.mesh.primitive_cube_add(size=1, location=(char_x + x_sign * 0.055, char_y + 0.02, char_z + 0.31))
    brow = bpy.context.active_object
    brow.name = f'ChaoBrow_{"L" if x_sign < 0 else "R"}'
    brow.scale = (0.06, 0.015, 0.012)
    brow.rotation_euler = (0.25, 0, x_sign * 0.45)
    set_material(brow, mat_black)

# Ears (small spheres on sides of head)
for x_sign in [-1, 1]:
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.025, segments=8, ring_count=6,
                                          location=(char_x + x_sign * 0.13, char_y - 0.02, char_z + 0.24))
    ear = bpy.context.active_object
    ear.name = f'ChaoEar_{"L" if x_sign < 0 else "R"}'
    set_material(ear, mat_skin)

# ═══════════════════════════════════════════════════════
#  ARMS — Reaching to steering wheel
# ═══════════════════════════════════════════════════════

# Steering wheel position: (-0.18, 0.12, 0.52)
# Character shoulder position: (char_x ± 0.12, char_y - 0.05, char_z + 0.12)
# Character hand position: on steering wheel

wheel_center = (-0.18, 0.12, 0.52)

for side in ['L', 'R']:
    x_sign = -1 if side == 'L' else 1
    
    # Shoulder position
    shoulder = (char_x + x_sign * 0.12, char_y - 0.05, char_z + 0.12)
    
    # Hand position on wheel (slightly offset from center)
    hand = (wheel_center[0] + x_sign * 0.045, wheel_center[1], wheel_center[2] + 0.01)
    
    # Calculate arm direction
    dx = hand[0] - shoulder[0]
    dy = hand[1] - shoulder[1]
    dz = hand[2] - shoulder[2]
    length = math.sqrt(dx*dx + dy*dy + dz*dz)
    
    # Arm midpoint
    mid = ((shoulder[0] + hand[0]) / 2, (shoulder[1] + hand[1]) / 2, (shoulder[2] + hand[2]) / 2)
    
    # Create arm cylinder
    bpy.ops.mesh.primitive_cylinder_add(radius=0.025, depth=length, location=mid)
    arm = bpy.context.active_object
    arm.name = f'ChaoArm_{side}'
    
    # Calculate rotation to point from shoulder to hand
    # Cylinder default is along Z, need to rotate to match direction vector
    # Direction vector (dx, dy, dz) normalized
    if length > 0:
        nx, ny, nz = dx/length, dy/length, dz/length
        # Rotation to align Z-axis with (nx, ny, nz)
        # Use look_at-like rotation
        arm.rotation_euler = (
            math.asin(ny),  # X rotation
            -math.asin(nx / math.sqrt(1 - ny*ny)) if abs(ny) < 0.999 else 0,  # Y rotation
            0  # Z rotation
        )
    
    set_material(arm, mat_skin)
    
    # Hand (small sphere on wheel)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.022, segments=8, ring_count=6, location=hand)
    hand_obj = bpy.context.active_object
    hand_obj.name = f'ChaoHand_{side}'
    set_material(hand_obj, mat_skin)

# ═══════════════════════════════════════════════════════
#  MASCOT HOOD ORNAMENT (kept as co-pilot ornament)
# ═══════════════════════════════════════════════════════

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.12, segments=18, ring_count=12, location=(0, 1.38, 0.52))
hood_mascot = bpy.context.active_object
hood_mascot.name = 'HoodMascot'
set_material(hood_mascot, mat_skin)
smooth_shade(hood_mascot)

for x_sign in [-1, 1]:
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.035, segments=10, ring_count=6, 
                                          location=(x_sign * 0.04, 1.44, 0.56))
    eye = bpy.context.active_object
    eye.name = f'HoodMascotEye_{"L" if x_sign < 0 else "R"}'
    eye.scale = (1.0, 0.7, 0.6)
    set_material(eye, mat_white)
    
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.018, segments=8, ring_count=5,
                                          location=(x_sign * 0.04, 1.46, 0.56))
    pupil = bpy.context.active_object
    pupil.name = f'HoodMascotPupil_{"L" if x_sign < 0 else "R"}'
    set_material(pupil, mat_black)

for x_sign in [-1, 1]:
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x_sign * 0.055, 1.40, 0.62))
    brow = bpy.context.active_object
    brow.name = f'HoodMascotBrow_{"L" if x_sign < 0 else "R"}'
    brow.scale = (0.06, 0.015, 0.01)
    brow.rotation_euler = (0.3, 0, x_sign * 0.5)
    set_material(brow, mat_black)

# ═══════════════════════════════════════════════════════
#  TRACK
# ═══════════════════════════════════════════════════════

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
ei = bpy.context.active_object
ei.name = 'TrackEdgeInner'
ei.scale = (1.0, 1.0, 0.06)
set_material(ei, mat_neon)

bpy.ops.mesh.primitive_torus_add(major_radius=track_radius + track_width/2 + 0.05, minor_radius=0.025, location=(0, 0, 0.03))
eo = bpy.context.active_object
eo.name = 'TrackEdgeOuter'
eo.scale = (1.0, 1.0, 0.06)
set_material(eo, mat_neon)

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

# ═══════════════════════════════════════════════════════
#  PARENTING
# ═══════════════════════════════════════════════════════

bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
car_root = bpy.context.active_object
car_root.name = '$MAD_Car'

for obj in bpy.context.scene.objects:
    if obj.type == 'MESH' and not obj.name.startswith('Track'):
        obj.parent = car_root

bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
track_root = bpy.context.active_object
track_root.name = '$MAD_Track'

for obj in bpy.context.scene.objects:
    if obj.type == 'MESH' and obj.name.startswith('Track'):
        obj.parent = track_root

# ═══════════════════════════════════════════════════════
#  LIGHTING
# ═══════════════════════════════════════════════════════

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

# ═══════════════════════════════════════════════════════
#  EXPORT
# ═══════════════════════════════════════════════════════

output = '/tmp/mad_car_v4.glb'

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

print(f"✅ MAD Car v4 — The Chao Drives!")
print(f"📦 Size: {os.path.getsize(output) / 1024:.1f} KB")
print(f"📊 Meshes: {len([o for o in bpy.context.scene.objects if o.type == 'MESH'])}")
