#!/usr/bin/env python3
"""
MAD Chao v2 — Stylized Character Study
Built using Grant Abbitt's low-poly character techniques:
1. Box modeling (cube → scale → loop cuts → shape)
2. Mirror modifier for symmetry
3. Edge loops for clean topology
4. Proportional editing for organic shapes
5. Separate eye geometry with proper pupils

This is a PRACTICE build — applying study material to real work.
"""

import bpy
import bmesh
import math
import os

# Clean scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

for material in bpy.data.materials:
    bpy.data.materials.remove(material)

# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------
def create_mat(name, color, roughness=0.7, emission=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (*color, 1.0)
    bsdf.inputs['Roughness'].default_value = roughness
    if emission > 0:
        bsdf.inputs['Emission'].default_value = (*color, 1.0)
        bsdf.inputs['Emission Strength'].default_value = emission
    return mat

def apply_mirror(obj):
    mod = obj.modifiers.new(name="Mirror", type='MIRROR')
    mod.use_axis = (True, False, False)
    mod.use_clip = True
    return mod

def shade_smooth(obj):
    mesh = obj.data
    for poly in mesh.polygons:
        poly.use_smooth = True

# ---------------------------------------------------------------------------
# Materials
# ---------------------------------------------------------------------------
mat_red = create_mat("ChaoRed", (0.95, 0.15, 0.2), roughness=0.4)
mat_dark_red = create_mat("ChaoDarkRed", (0.7, 0.08, 0.12), roughness=0.5)
mat_white = create_mat("ChaoWhite", (0.98, 0.98, 0.98), roughness=0.3)
mat_black = create_mat("ChaoBlack", (0.05, 0.05, 0.05), roughness=0.6)
mat_eye = create_mat("ChaoEye", (0.1, 0.1, 0.15), roughness=0.1)
mat_pupil = create_mat("ChaoPupil", (0.98, 0.98, 0.98), roughness=0.1)

def set_material(obj, mat):
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)

# ---------------------------------------------------------------------------
# BODY — Grant Abbitt style: start with cube, shape with loop cuts
# ---------------------------------------------------------------------------
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.4))
body = bpy.context.active_object
body.name = "ChaoBody"
body.scale = (0.6, 0.5, 0.55)

# Enter edit mode for shaping
bpy.context.view_layer.objects.active = body
bpy.ops.object.mode_set(mode='EDIT')

bm = bmesh.from_edit_mesh(body.data)

# Add loop cuts for shaping (Grant Abbitt technique)
# We need to select edges and subdivide them
# Body top loop (for head socket)
edges_to_cut = []
for edge in bm.edges:
    # Get vertices of edge
    v1, v2 = edge.verts
    # Find horizontal edges at top of body
    if v1.co.z > 0.3 and v2.co.z > 0.3 and abs(v1.co.z - v2.co.z) < 0.1:
        edges_to_cut.append(edge)

# Subdivide selected edges
if edges_to_cut:
    for e in edges_to_cut:
        e.select = True
    bmesh.ops.subdivide_edges(bm, edges=edges_to_cut, cuts=1)

# Add vertical loop cuts for arm sockets
vert_edges = []
for edge in bm.edges:
    v1, v2 = edge.verts
    # Vertical edges at sides
    if abs(v1.co.x - v2.co.x) < 0.1 and (abs(v1.co.x) > 0.5 or abs(v2.co.x) > 0.5):
        vert_edges.append(edge)

if vert_edges:
    for e in vert_edges:
        e.select = True
    bmesh.ops.subdivide_edges(bm, edges=vert_edges, cuts=1)

# Shape the body — push top center up for neck
for vert in bm.verts:
    x, y, z = vert.co
    # Round the bottom
    if z < -0.2:
        vert.co.z *= 0.7
    # Push top up slightly
    if z > 0.3:
        vert.co.z *= 1.1

bmesh.update_edit_mesh(body.data)
bpy.ops.object.mode_set(mode='OBJECT')

shade_smooth(body)
set_material(body, mat_red)
apply_mirror(body)

# ---------------------------------------------------------------------------
# HEAD — Start with cube, shape into rounded Chao head
# ---------------------------------------------------------------------------
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 1.05))
head = bpy.context.active_object
head.name = "ChaoHead"
head.scale = (0.42, 0.38, 0.4)

bpy.ops.object.mode_set(mode='EDIT')
bm = bmesh.from_edit_mesh(head.data)

# Subdivide twice for smooth sphere-like shape
for edge in bm.edges:
    edge.select = True
bmesh.ops.subdivide_edges(bm, edges=list(bm.edges), cuts=2)

# Make it more spherical (Chao heads are round)
for vert in bm.verts:
    x, y, z = vert.co
    # Normalize to sphere shape
    length = math.sqrt(x*x + y*y + z*z)
    if length > 0:
        target = 0.5
        vert.co *= target / length

# Flatten bottom of head where it connects to neck
for vert in bm.verts:
    if vert.co.z < -0.3:
        vert.co.z = -0.3

# Pull front forward slightly (Chao face protrudes)
for vert in bm.verts:
    if vert.co.y > 0.2 and vert.co.z > -0.1:
        vert.co.y *= 1.15

bmesh.update_edit_mesh(head.data)
bpy.ops.object.mode_set(mode='OBJECT')

shade_smooth(head)
set_material(head, mat_red)
apply_mirror(head)

# ---------------------------------------------------------------------------
# EYES — Separate geometry, not just materials (proper technique)
# ---------------------------------------------------------------------------
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.12, location=(0.18, 0.25, 1.08))
eye = bpy.context.active_object
eye.name = "ChaoEye"
eye.scale = (1.0, 0.8, 1.0)
shade_smooth(eye)
set_material(eye, mat_eye)
apply_mirror(eye)

# Pupils (white dots)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.05, location=(0.2, 0.32, 1.08))
pupil = bpy.context.active_object
pupil.name = "ChaoPupil"
pupil.scale = (0.8, 0.6, 1.0)
shade_smooth(pupil)
set_material(pupil, mat_pupil)
apply_mirror(pupil)

# ---------------------------------------------------------------------------
# EARS — Small spheres on top of head
# ---------------------------------------------------------------------------
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.1, location=(0.32, -0.05, 1.35))
ear = bpy.context.active_object
ear.name = "ChaoEar"
ear.scale = (0.6, 0.5, 0.8)
shade_smooth(ear)
set_material(ear, mat_red)
apply_mirror(ear)

# ---------------------------------------------------------------------------
# EYEBROWS — Angry Chao eyebrows (small curved shapes)
# ---------------------------------------------------------------------------
bpy.ops.mesh.primitive_cube_add(size=1, location=(0.15, 0.28, 1.2))
eyebrow = bpy.context.active_object
eyebrow.name = "ChaoEyebrow"
eyebrow.scale = (0.08, 0.15, 0.03)
eyebrow.rotation_euler = (0.3, 0, -0.3)
shade_smooth(eyebrow)
set_material(eyebrow, mat_dark_red)
apply_mirror(eyebrow)

# ---------------------------------------------------------------------------
# ARMS — Cylinders (Grant Abbitt style: simple, clear shapes)
# ---------------------------------------------------------------------------
# Shoulder
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.12, location=(0.55, 0, 0.55))
shoulder = bpy.context.active_object
shoulder.name = "ChaoShoulder"
shade_smooth(shoulder)
set_material(shoulder, mat_red)
apply_mirror(shoulder)

# Arm (cylinder)
bpy.ops.mesh.primitive_cylinder_add(radius=0.06, depth=0.4, location=(0.7, 0.1, 0.4))
arm = bpy.context.active_object
arm.name = "ChaoArm"
arm.rotation_euler = (0.5, 0, -0.4)
shade_smooth(arm)
set_material(arm, mat_red)
apply_mirror(arm)

# Hand (small sphere)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.09, location=(0.82, 0.18, 0.22))
hand = bpy.context.active_object
hand.name = "ChaoHand"
shade_smooth(hand)
set_material(hand, mat_white)
apply_mirror(hand)

# ---------------------------------------------------------------------------
# LEGS — Short stubby Chao legs
# ---------------------------------------------------------------------------
bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=0.25, location=(0.25, 0.15, -0.15))
leg = bpy.context.active_object
leg.name = "ChaoLeg"
leg.rotation_euler = (0.3, 0, 0.1)
shade_smooth(leg)
set_material(leg, mat_red)
apply_mirror(leg)

# Feet
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.12, location=(0.3, 0.22, -0.3))
foot = bpy.context.active_object
foot.name = "ChaoFoot"
foot.scale = (0.7, 1.0, 0.5)
shade_smooth(foot)
set_material(foot, mat_white)
apply_mirror(foot)

# ---------------------------------------------------------------------------
# TAIL — Small stub
# ---------------------------------------------------------------------------
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.08, location=(0, -0.45, 0.3))
tail = bpy.context.active_object
tail.name = "ChaoTail"
tail.scale = (0.8, 1.2, 0.8)
shade_smooth(tail)
set_material(tail, mat_red)

# ---------------------------------------------------------------------------
# HALO — Emissive floating ring above head (classic Chao feature)
# ---------------------------------------------------------------------------
bpy.ops.mesh.primitive_torus_add(major_radius=0.25, minor_radius=0.02, location=(0, 0, 1.6))
halo = bpy.context.active_object
halo.name = "ChaoHalo"
halo.rotation_euler = (0.3, 0, 0)
set_material(halo, mat_white)

# ---------------------------------------------------------------------------
# Export
# ---------------------------------------------------------------------------
export_path = "/tmp/mad_chao_v2.glb"
bpy.ops.export_scene.gltf(
    filepath=export_path,
    export_format='GLB',
    export_materials='EXPORT',
    export_image_format='WEBP',
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
)

file_size = os.path.getsize(export_path) / 1024
mesh_count = len([o for o in bpy.data.objects if o.type == 'MESH'])

print(f"\n✅ MAD Chao v2 — Grant Abbitt Style!")
print(f"📦 Size: {file_size:.1f} KB")
print(f"📊 Meshes: {mesh_count}")
print(f"🎨 Style: Low-poly stylized (Chao-inspired)")
print(f"Blender {bpy.app.version_string}")
