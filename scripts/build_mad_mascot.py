"""
$MAD Mascot Builder — Blender Python Script
Builds a proper chibi mascot with subdivision surfaces, sculpted details,
Principled BSDF materials, and exports to glTF 2.0 (.glb)

Usage: blender -b --python build_mad_mascot.py
"""

import bpy
import bmesh
import math
import os

# Clean scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# ─── MATERIALS ───
def create_skin_mat(name, color, subsurface=0.3):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    # Clear default
    for node in nodes:
        if node.type != 'OUTPUT_MATERIAL':
            nodes.remove(node)
    
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)
    
    # Red skin with subsurface scattering
    bsdf.inputs['Base Color'].default_value = (*color, 1.0)
    bsdf.inputs['Subsurface Weight'].default_value = subsurface
    bsdf.inputs['Subsurface Radius'].default_value = (1.0, 0.2, 0.1)
    bsdf.inputs['Subsurface Scale'].default_value = 0.02
    bsdf.inputs['Roughness'].default_value = 0.35
    bsdf.inputs['Specular IOR Level'].default_value = 0.5
    
    output = nodes['Material Output']
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    return mat

skin_main = create_skin_mat('MAD_Skin', (0.9, 0.0, 0.0), 0.4)
skin_dark = create_skin_mat('MAD_Skin_Dark', (0.7, 0.0, 0.0), 0.2)

# Black material for boots/gloves/backpack
def create_black_mat(name):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = (0.05, 0.05, 0.05, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.6
    bsdf.inputs['Specular IOR Level'].default_value = 0.3
    return mat

mat_black = create_black_mat('MAD_Black')

# White material for eyes
def create_eye_white():
    mat = bpy.data.materials.new(name='MAD_EyeWhite')
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = (1.0, 1.0, 1.0, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.1
    bsdf.inputs['Specular IOR Level'].default_value = 0.8
    return mat

mat_eye_white = create_eye_white()

# Pupil material
def create_pupil():
    mat = bpy.data.materials.new(name='MAD_Pupil')
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = (0.02, 0.02, 0.02, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.05
    return mat

mat_pupil = create_pupil()

# Gold for emblem
def create_gold():
    mat = bpy.data.materials.new(name='MAD_Gold')
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = (1.0, 0.84, 0.0, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.2
    bsdf.inputs['Metallic'].default_value = 0.8
    return mat

mat_gold = create_gold()

# ─── HELPERS ───
def add_subsurf(obj, levels=2):
    """Add subdivision surface modifier for smooth organic shapes"""
    mod = obj.modifiers.new(name='Subdivision', type='SUBSURF')
    mod.levels = levels
    mod.render_levels = levels
    mod.subdivision_type = 'CATMULL_CLARK'
    
def smooth_shade(obj):
    """Enable smooth shading on all faces"""
    mesh = obj.data
    for poly in mesh.polygons:
        poly.use_smooth = True

def create_uv_sphere(name, radius, segments, rings, mat):
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=radius,
        segments=segments,
        ring_count=rings,
        location=(0, 0, 0)
    )
    obj = bpy.context.active_object
    obj.name = name
    obj.data.materials.append(mat)
    smooth_shade(obj)
    return obj

def create_ico_sphere(name, radius, subdivisions, mat):
    bpy.ops.mesh.primitive_ico_sphere_add(
        radius=radius,
        subdivisions=subdivisions,
        location=(0, 0, 0)
    )
    obj = bpy.context.active_object
    obj.name = name
    obj.data.materials.append(mat)
    smooth_shade(obj)
    return obj

# ─── HEAD ───
# Main head sphere with subdivision for smooth organic look
head = create_uv_sphere('Head', 0.52, 32, 16, skin_main)
add_subsurf(head, 2)

# ─── EYE SOCKETS (Boolean subtraction for eye cavities) ───
# Left eye socket
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.15, segments=16, ring_count=12, location=(-0.17, 0.42, 0.08))
eye_socket_L = bpy.context.active_object
eye_socket_L.name = 'EyeSocket_L'
eye_socket_L.scale = (0.8, 0.6, 0.4)
eye_socket_L.rotation_euler = (0.1, -0.1, 0)

# Right eye socket
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.15, segments=16, ring_count=12, location=(0.17, 0.42, 0.08))
eye_socket_R = bpy.context.active_object
eye_socket_R.name = 'EyeSocket_R'
eye_socket_R.scale = (0.8, 0.6, 0.4)
eye_socket_R.rotation_euler = (0.1, 0.1, 0)

# Boolean difference on head
bool_L = head.modifiers.new(name='Bool_L', type='BOOLEAN')
bool_L.operation = 'DIFFERENCE'
bool_L.object = eye_socket_L

bool_R = head.modifiers.new(name='Bool_R', type='BOOLEAN')
bool_R.operation = 'DIFFERENCE'
bool_R.object = eye_socket_R

# Apply booleans
bpy.context.view_layer.objects.active = head
bpy.ops.object.modifier_apply(modifier='Bool_L')
bpy.ops.object.modifier_apply(modifier='Bool_R')

# Delete socket helper objects
bpy.data.objects.remove(eye_socket_L)
bpy.data.objects.remove(eye_socket_R)

# ─── EYE WHITES (Sclera) ───
# Left sclera
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.13, segments=16, ring_count=12, location=(-0.17, 0.42, 0.06))
sclera_L = bpy.context.active_object
sclera_L.name = 'Sclera_L'
sclera_L.scale = (1.0, 0.75, 0.5)
sclera_L.rotation_euler = (0.1, -0.1, 0)
sclera_L.data.materials.append(mat_eye_white)
smooth_shade(sclera_L)

# Right sclera
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.13, segments=16, ring_count=12, location=(0.17, 0.42, 0.06))
sclera_R = bpy.context.active_object
sclera_R.name = 'Sclera_R'
sclera_R.scale = (1.0, 0.75, 0.5)
sclera_R.rotation_euler = (0.1, 0.1, 0)
sclera_R.data.materials.append(mat_eye_white)
smooth_shade(sclera_R)

# ─── PUPILS ───
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.07, segments=12, ring_count=8, location=(-0.17, 0.46, 0.08))
pupil_L = bpy.context.active_object
pupil_L.name = 'Pupil_L'
pupil_L.data.materials.append(mat_pupil)
smooth_shade(pupil_L)

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.07, segments=12, ring_count=8, location=(0.17, 0.46, 0.08))
pupil_R = bpy.context.active_object
pupil_R.name = 'Pupil_R'
pupil_R.data.materials.append(mat_pupil)
smooth_shade(pupil_R)

# ─── EYEBROWS (Bezier curves → mesh for sharp V-shape) ───
def create_eyebrow(name, location, rotation, scale):
    # Create a curve for the eyebrow
    curve_data = bpy.data.curves.new(name=name, type='CURVE')
    curve_data.dimensions = '3D'
    curve_data.resolution_u = 12
    curve_data.bevel_depth = 0.025
    curve_data.bevel_resolution = 3
    
    spline = curve_data.splines.new('BEZIER')
    spline.bezier_points.add(2)
    
    # V-shape: start low → middle high → end low
    points = spline.bezier_points
    points[0].co = (-0.1, 0, 0)
    points[0].handle_left = (-0.1, 0, -0.05)
    points[0].handle_right = (-0.05, 0, 0.05)
    
    points[1].co = (0, 0, 0.08)  # Peak of V
    points[1].handle_left = (-0.03, 0, 0.05)
    points[1].handle_right = (0.03, 0, 0.05)
    
    points[2].co = (0.1, 0, 0)
    points[2].handle_left = (0.05, 0, 0.05)
    points[2].handle_right = (0.1, 0, -0.05)
    
    obj = bpy.data.objects.new(name=name, object_data=curve_data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = rotation
    obj.scale = scale
    
    # Convert to mesh for subdivision
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='OBJECT')
    bpy.ops.object.convert(target='MESH')
    mesh_obj = bpy.context.active_object
    mesh_obj.data.materials.append(mat_black)
    smooth_shade(mesh_obj)
    add_subsurf(mesh_obj, 1)
    return mesh_obj

# Left eyebrow (angles down toward center)
eyebrow_L = create_eyebrow('Eyebrow_L', (-0.19, 0.52, 0.35), (0.2, 0, 0.6), (1.0, 1.0, 0.8))

# Right eyebrow (angles down toward center)
eyebrow_R = create_eyebrow('Eyebrow_R', (0.19, 0.52, 0.35), (0.2, 0, -0.6), (1.0, 1.0, 0.8))

# ─── MOUTH (Small frown — depressed curve) ───
mouth_curve = bpy.data.curves.new(name='MouthCurve', type='CURVE')
mouth_curve.dimensions = '3D'
mouth_curve.resolution_u = 8
mouth_curve.bevel_depth = 0.012
mouth_curve.bevel_resolution = 2

spline = mouth_curve.splines.new('BEZIER')
spline.bezier_points.add(2)
points = spline.bezier_points
points[0].co = (-0.04, 0, 0)
points[0].handle_right = (-0.02, 0, 0.02)
points[1].co = (0, 0, -0.015)
points[1].handle_left = (-0.02, 0, -0.02)
points[1].handle_right = (0.02, 0, -0.02)
points[2].co = (0.04, 0, 0)
points[2].handle_left = (0.02, 0, 0.02)

mouth_obj = bpy.data.objects.new(name='Mouth', object_data=mouth_curve)
bpy.context.collection.objects.link(mouth_obj)
mouth_obj.location = (0, 0.32, 0.42)
mouth_obj.rotation_euler = (0.2, 0, 0)

# Convert to mesh
bpy.context.view_layer.objects.active = mouth_obj
bpy.ops.object.select_all(action='DESELECT')
mouth_obj.select_set(True)
bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.object.convert(target='MESH')
mouth_mesh = bpy.context.active_object
mouth_mesh.data.materials.append(mat_black)
smooth_shade(mouth_mesh)

# ─── NOSE (Small bump) ───
nose = create_ico_sphere('Nose', 0.025, 2, skin_dark)
nose.location = (0, 0.48, 0.5)
nose.scale = (1.0, 0.7, 0.8)

# ─── EARS (Small round) ───
# Left ear
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.08, segments=12, ring_count=8, location=(-0.5, 0.02, 0))
ear_L = bpy.context.active_object
ear_L.name = 'Ear_L'
ear_L.scale = (0.8, 1.0, 0.6)
ear_L.data.materials.append(skin_main)
smooth_shade(ear_L)
add_subsurf(ear_L, 1)

# Right ear
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.08, segments=12, ring_count=8, location=(0.5, 0.02, 0))
ear_R = bpy.context.active_object
ear_R.name = 'Ear_R'
ear_R.scale = (0.8, 1.0, 0.6)
ear_R.data.materials.append(skin_main)
smooth_shade(ear_R)
add_subsurf(ear_R, 1)

# ─── BODY ───
# Main body — slightly flattened sphere for chibi look
body = create_uv_sphere('Body', 0.42, 24, 16, skin_main)
body.scale = (1.0, 0.85, 0.75)
body.location = (0, -0.35, 0)
add_subsurf(body, 2)

# Belly highlight
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.2, segments=12, ring_count=8, location=(0, -0.35, 0.28))
belly = bpy.context.active_object
belly.name = 'Belly'
belly.scale = (1.0, 0.8, 0.5)
belly.data.materials.append(skin_dark)
smooth_shade(belly)
add_subsurf(belly, 1)

# $MAD emblem on chest
bpy.ops.mesh.primitive_cylinder_add(radius=0.06, depth=0.02, location=(0, -0.2, 0.32))
emblem = bpy.context.active_object
emblem.name = 'Emblem'
emblem.scale = (1.2, 0.8, 1.0)
emblem.rotation_euler = (0.1, 0, 0.1)
emblem.data.materials.append(mat_gold)

# Belt
bpy.ops.mesh.primitive_torus_add(major_radius=0.38, minor_radius=0.03, location=(0, -0.55, 0))
belt = bpy.context.active_object
belt.name = 'Belt'
belt.scale = (1.0, 0.85, 0.75)
belt.data.materials.append(mat_black)
smooth_shade(belt)

# ─── ARMS ───
# Left arm (upper)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.09, segments=12, ring_count=8, location=(-0.38, -0.15, 0))
arm_L = bpy.context.active_object
arm_L.name = 'Arm_L'
arm_L.scale = (0.8, 1.4, 0.8)
arm_L.data.materials.append(skin_main)
smooth_shade(arm_L)
add_subsurf(arm_L, 1)

# Right arm (upper)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.09, segments=12, ring_count=8, location=(0.38, -0.15, 0))
arm_R = bpy.context.active_object
arm_R.name = 'Arm_R'
arm_R.scale = (0.8, 1.4, 0.8)
arm_R.data.materials.append(skin_main)
smooth_shade(arm_R)
add_subsurf(arm_R, 1)

# Left forearm
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.07, segments=10, ring_count=6, location=(-0.38, -0.38, 0.02))
forearm_L = bpy.context.active_object
forearm_L.name = 'Forearm_L'
forearm_L.scale = (0.7, 1.2, 0.7)
forearm_L.data.materials.append(skin_dark)
smooth_shade(forearm_L)

# Right forearm
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.07, segments=10, ring_count=6, location=(0.38, -0.38, 0.02))
forearm_R = bpy.context.active_object
forearm_R.name = 'Forearm_R'
forearm_R.scale = (0.7, 1.2, 0.7)
forearm_R.data.materials.append(skin_dark)
smooth_shade(forearm_R)

# Left glove
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.1, segments=10, ring_count=8, location=(-0.38, -0.5, 0.02))
glove_L = bpy.context.active_object
glove_L.name = 'Glove_L'
glove_L.scale = (1.0, 0.8, 0.9)
glove_L.data.materials.append(mat_black)
smooth_shade(glove_L)

# Right glove
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.1, segments=10, ring_count=8, location=(0.38, -0.5, 0.02))
glove_R = bpy.context.active_object
glove_R.name = 'Glove_R'
glove_R.scale = (1.0, 0.8, 0.9)
glove_R.data.materials.append(mat_black)
smooth_shade(glove_R)

# ─── LEGS ───
# Left thigh
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.1, segments=12, ring_count=8, location=(-0.17, -0.7, 0))
thigh_L = bpy.context.active_object
thigh_L.name = 'Thigh_L'
thigh_L.scale = (0.9, 1.6, 0.9)
thigh_L.data.materials.append(skin_main)
smooth_shade(thigh_L)
add_subsurf(thigh_L, 1)

# Right thigh
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.1, segments=12, ring_count=8, location=(0.17, -0.7, 0))
thigh_R = bpy.context.active_object
thigh_R.name = 'Thigh_R'
thigh_R.scale = (0.9, 1.6, 0.9)
thigh_R.data.materials.append(skin_main)
smooth_shade(thigh_R)
add_subsurf(thigh_R, 1)

# Left shin
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.08, segments=10, ring_count=6, location=(-0.17, -0.95, 0.02))
shin_L = bpy.context.active_object
shin_L.name = 'Shin_L'
shin_L.scale = (0.8, 1.3, 0.8)
shin_L.data.materials.append(skin_dark)
smooth_shade(shin_L)

# Right shin
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.08, segments=10, ring_count=6, location=(0.17, -0.95, 0.02))
shin_R = bpy.context.active_object
shin_R.name = 'Shin_R'
shin_R.scale = (0.8, 1.3, 0.8)
shin_R.data.materials.append(skin_dark)
smooth_shade(shin_R)

# Left boot
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.12, segments=12, ring_count=8, location=(-0.17, -1.08, 0.02))
boot_L = bpy.context.active_object
boot_L.name = 'Boot_L'
boot_L.scale = (1.0, 0.8, 1.1)
boot_L.data.materials.append(mat_black)
smooth_shade(boot_L)

# Right boot
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.12, segments=12, ring_count=8, location=(0.17, -1.08, 0.02))
boot_R = bpy.context.active_object
boot_R.name = 'Boot_R'
boot_R.scale = (1.0, 0.8, 1.1)
boot_R.data.materials.append(mat_black)
smooth_shade(boot_R)

# Boot soles
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.17, -1.15, 0.02))
sole_L = bpy.context.active_object
sole_L.name = 'Sole_L'
sole_L.scale = (0.22, 0.04, 0.18)
sole_L.data.materials.append(mat_black)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.17, -1.15, 0.02))
sole_R = bpy.context.active_object
sole_R.name = 'Sole_R'
sole_R.scale = (0.22, 0.04, 0.18)
sole_R.data.materials.append(mat_black)

# ─── BACKPACK ───
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.3, -0.3))
backpack = bpy.context.active_object
backpack.name = 'Backpack'
backpack.scale = (0.3, 0.25, 0.12)
backpack.data.materials.append(mat_black)
smooth_shade(backpack)
add_subsurf(backpack, 1)

# Backpack straps
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.1, -0.15, -0.2))
strap_L = bpy.context.active_object
strap_L.name = 'Strap_L'
strap_L.scale = (0.03, 0.25, 0.02)
strap_L.data.materials.append(mat_black)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0.1, -0.15, -0.2))
strap_R = bpy.context.active_object
strap_R.name = 'Strap_R'
strap_R.scale = (0.03, 0.25, 0.02)
strap_R.data.materials.append(mat_black)

# Backpack LED
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.04, segments=8, ring_count=6, location=(0, -0.2, -0.38))
led = bpy.context.active_object
led.name = 'Backpack_LED'
led.data.materials.append(skin_main)
smooth_shade(led)

# ─── JOIN ALL INTO SINGLE OBJECT ───
# (Optional: for simpler export, we can keep separate or join)
# For rigging, we'll keep separate but parent to a root empty

bpy.ops.object.empty_add(type='ARROWS', location=(0, 0, 0))
root = bpy.context.active_object
root.name = '$MAD_Mascot'

# Parent all objects to root
objects_to_parent = [head, sclera_L, sclera_R, pupil_L, pupil_R, eyebrow_L, eyebrow_R,
                     mouth_mesh, nose, ear_L, ear_R, body, belly, emblem, belt,
                     arm_L, arm_R, forearm_L, forearm_R, glove_L, glove_R,
                     thigh_L, thigh_R, shin_L, shin_R, boot_L, boot_R, sole_L, sole_R,
                     backpack, strap_L, strap_R, led]

for obj in objects_to_parent:
    obj.parent = root

# ─── CAMERA AND LIGHTING FOR PREVIEW ───
bpy.ops.object.camera_add(location=(0, 1.5, 4))
cam = bpy.context.active_object
cam.name = 'PreviewCamera'
cam.rotation_euler = (0.35, 0, 0)

# Key light (warm)
bpy.ops.object.light_add(type='SUN', location=(3, 5, 6))
key_light = bpy.context.active_object
key_light.name = 'KeyLight'
key_light.data.energy = 3.0
key_light.data.color = (1.0, 0.95, 0.9)

# Fill light (cool)
bpy.ops.object.light_add(type='AREA', location=(-3, 2, 3))
fill_light = bpy.context.active_object
fill_light.name = 'FillLight'
fill_light.data.energy = 1.5
fill_light.data.color = (0.85, 0.9, 1.0)
fill_light.data.size = 3.0

# Rim light (red)
bpy.ops.object.light_add(type='SPOT', location=(0, -2, -3))
rim_light = bpy.context.active_object
rim_light.name = 'RimLight'
rim_light.data.energy = 5.0
rim_light.data.color = (1.0, 0.3, 0.3)
rim_light.data.spot_size = 1.2

# ─── EXPORT TO GLTF ───
output_path = '/tmp/mad_mascot.glb'

# Select root and all children for export
bpy.ops.object.select_all(action='DESELECT')
root.select_set(True)
for obj in objects_to_parent:
    obj.select_set(True)

# Export settings optimized for web
bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    use_selection=True,
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
    export_extras=False,
)

print(f"✅ $MAD Mascot exported to: {output_path}")
print(f"📦 File size: {os.path.getsize(output_path) / 1024:.1f} KB")
