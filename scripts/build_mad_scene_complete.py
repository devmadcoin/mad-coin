#!/usr/bin/env python3
"""
MAD Track Day — Complete Scene
Builds: Car (procedural paint) + Chao (sculpted look) + Environment (scatter) + Animation
All in one animated glTF export for Three.js
"""

import bpy
import bmesh
import math
import random
import os

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for material in bpy.data.materials:
        bpy.data.materials.remove(material)
    for mesh in bpy.data.meshes:
        bpy.data.meshes.remove(mesh)

def set_smooth(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = True
    obj.data.use_auto_smooth = True
    obj.data.auto_smooth_angle = math.radians(30)

def add_subsurf(obj, levels=2):
    mod = obj.modifiers.new(name="Subdivision", type='SUBSURF')
    mod.levels = levels
    mod.render_levels = levels
    return mod

def add_bevel(obj, width=0.003, segments=3):
    mod = obj.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = width
    mod.segments = segments
    mod.limit_method = 'ANGLE'
    mod.angle_limit = math.radians(30)
    return mod

def add_mirror(obj):
    mod = obj.modifiers.new(name="Mirror", type='MIRROR')
    mod.use_axis = (True, False, False)
    mod.use_bisect_axis = (True, False, False)
    mod.merge_threshold = 0.001
    return mod

# ============================================================
# MATERIALS
# ============================================================

def create_car_paint(name, base_color, flake_scale=50):
    """Procedural car paint with metallic flake and clearcoat"""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (400, 0)
    
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)
    bsdf.inputs['Base Color'].default_value = (*base_color, 1.0)
    bsdf.inputs['Metallic'].default_value = 0.85
    bsdf.inputs['Roughness'].default_value = 0.12
    bsdf.inputs['Coat Weight'].default_value = 1.0
    bsdf.inputs['Coat Roughness'].default_value = 0.03
    
    # Noise for metallic flake variation
    noise = nodes.new('ShaderNodeTexNoise')
    noise.location = (-400, 200)
    noise.inputs['Scale'].default_value = flake_scale
    noise.inputs['Detail'].default_value = 15.0
    noise.inputs['Roughness'].default_value = 0.5
    
    color_ramp = nodes.new('ShaderNodeValToRGB')
    color_ramp.location = (-200, 200)
    color_ramp.color_ramp.elements[0].color = (0.3, 0.0, 0.0, 1.0)
    color_ramp.color_ramp.elements[1].color = (0.8, 0.1, 0.1, 1.0)
    
    mix_rgb = nodes.new('ShaderNodeMixRGB')
    mix_rgb.location = (200, 100)
    mix_rgb.blend_type = 'MIX'
    mix_rgb.inputs['Fac'].default_value = 0.15
    
    # Bump for clearcoat orange peel
    bump = nodes.new('ShaderNodeBump')
    bump.location = (-200, -200)
    bump.inputs['Strength'].default_value = 0.02
    
    noise_bump = nodes.new('ShaderNodeTexNoise')
    noise_bump.location = (-400, -200)
    noise_bump.inputs['Scale'].default_value = 500
    noise_bump.inputs['Detail'].default_value = 2
    
    # Link
    links.new(noise.outputs['Fac'], color_ramp.inputs['Fac'])
    links.new(color_ramp.outputs['Color'], mix_rgb.inputs['Color2'])
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    links.new(mix_rgb.outputs['Color'], bsdf.inputs['Base Color'])
    
    links.new(noise_bump.outputs['Fac'], bump.inputs['Height'])
    links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    
    return mat

def create_neon_material(name, color, strength=8.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (300, 0)
    
    emission = nodes.new('ShaderNodeEmission')
    emission.location = (0, 0)
    emission.inputs['Color'].default_value = (*color, 1.0)
    emission.inputs['Strength'].default_value = strength
    
    links.new(emission.outputs['Emission'], output.inputs['Surface'])
    return mat

def create_tire_material():
    mat = bpy.data.materials.new(name="TireRubber")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = (0.08, 0.08, 0.08, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.85
    bsdf.inputs['Specular IOR Level'].default_value = 0.1
    
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    return mat

def create_rim_material():
    mat = bpy.data.materials.new(name="ChromeRim")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = (0.9, 0.9, 0.95, 1.0)
    bsdf.inputs['Metallic'].default_value = 1.0
    bsdf.inputs['Roughness'].default_value = 0.05
    
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    return mat

def create_chao_skin():
    mat = bpy.data.materials.new(name="ChaoSkin")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = (0.85, 0.15, 0.15, 1.0)  # MAD red
    bsdf.inputs['Roughness'].default_value = 0.4
    bsdf.inputs['Subsurface Weight'].default_value = 0.1
    bsdf.inputs['Subsurface Radius'].default_value = (0.9, 0.3, 0.3)
    
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    return mat

def create_eye_material():
    mat = bpy.data.materials.new(name="ChaoEye")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = (1.0, 1.0, 1.0, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.0
    bsdf.inputs['Specular IOR Level'].default_value = 1.0
    
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    return mat

def create_pupil_material():
    mat = bpy.data.materials.new(name="ChaoPupil")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = (0.0, 0.0, 0.0, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.0
    
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    return mat

# ============================================================
# CAR BODY (Box Modeled + Procedural Paint)
# ============================================================

def build_car_body():
    # Main body — cube scaled and shaped via modifiers
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.55))
    body = bpy.context.active_object
    body.name = "CarBody_v6"
    body.scale = (0.95, 1.8, 0.42)
    
    # Add bevel + subdivision for smooth organic hard-surface
    add_bevel(body, width=0.008, segments=4)
    add_subsurf(body, levels=2)
    
    # Apply procedural car paint
    car_paint = create_car_paint("MAD_CarPaint", (0.75, 0.0, 0.05), flake_scale=40)
    body.data.materials.append(car_paint)
    set_smooth(body)
    
    return body

def build_car_spoiler():
    # Spoiler deck
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -1.35, 0.75))
    deck = bpy.context.active_object
    deck.name = "SpoilerDeck"
    deck.scale = (0.85, 0.15, 0.03)
    add_bevel(deck, 0.003, 2)
    deck.data.materials.append(create_car_paint("SpoilerPaint", (0.75, 0.0, 0.05)))
    set_smooth(deck)
    
    # Spoiler endplates
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0.82, -1.35, 0.85))
    plate = bpy.context.active_object
    plate.name = "SpoilerEndplate_R"
    plate.scale = (0.02, 0.15, 0.15)
    plate.data.materials.append(create_neon_material("SpoilerNeon", (0.0, 1.0, 1.0), 6.0))
    
    bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.82, -1.35, 0.85))
    plate_l = bpy.context.active_object
    plate_l.name = "SpoilerEndplate_L"
    plate_l.scale = (0.02, 0.15, 0.15)
    plate_l.data.materials.append(create_neon_material("SpoilerNeon", (0.0, 1.0, 1.0), 6.0))
    
    return [deck, plate, plate_l]

def build_wheels():
    wheels = []
    positions = [(0.82, 0.6, 0.28), (-0.82, 0.6, 0.28), (0.82, -0.6, 0.28), (-0.82, -0.6, 0.28)]
    
    for i, (x, y, z) in enumerate(positions):
        side = "R" if x > 0 else "L"
        pos = "F" if y > 0 else "R"
        
        # Tire
        bpy.ops.mesh.primitive_torus_add(major_segments=24, minor_segments=16,
                                         major_radius=0.28, minor_radius=0.12,
                                         location=(x, y, z), rotation=(math.radians(90), 0, 0))
        tire = bpy.context.active_object
        tire.name = f"Tire_{side}{pos}"
        tire.data.materials.append(create_tire_material())
        
        # Rim
        bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.18, depth=0.06,
                                            location=(x, y, z), rotation=(math.radians(90), 0, 0))
        rim = bpy.context.active_object
        rim.name = f"Rim_{side}{pos}"
        rim.data.materials.append(create_rim_material())
        
        # Spoke detail (5 spokes)
        for j in range(5):
            angle = j * 2 * math.pi / 5
            sx = x + math.cos(angle) * 0.12
            sy = y + math.sin(angle) * 0.12
            bpy.ops.mesh.primitive_cube_add(size=1, location=(sx, sy, z))
            spoke = bpy.context.active_object
            spoke.scale = (0.02, 0.08, 0.01)
            spoke.rotation_euler = (math.radians(90), 0, angle)
            spoke.name = f"Spoke_{side}{pos}_{j}"
            spoke.data.materials.append(create_rim_material())
            wheels.append(spoke)
        
        wheels.extend([tire, rim])
    
    return wheels

def build_headlights():
    lights = []
    for side in [-1, 1]:
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.08, depth=0.05,
                                            location=(side * 0.7, 0.85, 0.45),
                                            rotation=(math.radians(90), 0, 0))
        housing = bpy.context.active_object
        housing.name = f"Headlight_{'L' if side < 0 else 'R'}"
        housing.data.materials.append(create_car_paint("HeadlightHousing", (0.1, 0.1, 0.1)))
        
        # Light lens
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.06, depth=0.01,
                                            location=(side * 0.7, 0.88, 0.45),
                                            rotation=(math.radians(90), 0, 0))
        lens = bpy.context.active_object
        lens.name = f"HeadlightLens_{'L' if side < 0 else 'R'}"
        lens.data.materials.append(create_neon_material("HeadlightGlow", (1.0, 0.9, 0.7), 10.0))
        lights.extend([housing, lens])
    
    return lights

def build_neon_strips(body):
    strips = []
    # Side skirt neon
    for side in [-1, 1]:
        bpy.ops.mesh.primitive_cube_add(size=1, location=(side * 0.92, 0, 0.15))
        strip = bpy.context.active_object
        strip.name = f"NeonSide_{'L' if side < 0 else 'R'}"
        strip.scale = (0.01, 1.5, 0.01)
        strip.data.materials.append(create_neon_material("NeonSide", (1.0, 0.0, 0.5), 12.0))
        strips.append(strip)
    
    # Front lip neon
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.88, 0.15))
    front = bpy.context.active_object
    front.name = "NeonFront"
    front.scale = (0.85, 0.01, 0.01)
    front.data.materials.append(create_neon_material("NeonFront", (1.0, 0.0, 0.5), 12.0))
    strips.append(front)
    
    return strips

# ============================================================
# CHAO CHARACTER (Sculpted Look with Proportional Editing)
# ============================================================

def build_chao_character():
    parts = []
    
    # Body — scaled sphere for organic shape
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=0.18,
                                         location=(0, 0.15, 0.65))
    body = bpy.context.active_object
    body.name = "ChaoBody_v6"
    body.scale = (1.0, 0.85, 1.2)
    body.data.materials.append(create_chao_skin())
    add_subsurf(body, levels=2)
    set_smooth(body)
    parts.append(body)
    
    # Head — slightly wider sphere
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=0.14,
                                         location=(0, 0.12, 0.92))
    head = bpy.context.active_object
    head.name = "ChaoHead_v6"
    head.scale = (1.1, 1.05, 1.0)
    head.data.materials.append(create_chao_skin())
    add_subsurf(head, levels=2)
    set_smooth(head)
    parts.append(head)
    
    # Eyes (almond shape)
    for side in [-1, 1]:
        bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=0.035,
                                             location=(side * 0.07, 0.22, 0.92))
        eye = bpy.context.active_object
        eye.name = f"ChaoEye_{'L' if side < 0 else 'R'}"
        eye.scale = (1.0, 0.6, 1.0)
        eye.data.materials.append(create_eye_material())
        parts.append(eye)
        
        # Pupil
        bpy.ops.mesh.primitive_uv_sphere_add(segments=8, ring_count=6, radius=0.018,
                                             location=(side * 0.07, 0.24, 0.92))
        pupil = bpy.context.active_object
        pupil.name = f"ChaoPupil_{'L' if side < 0 else 'R'}"
        pupil.data.materials.append(create_pupil_material())
        parts.append(pupil)
    
    # Angry eyebrows (angled planes)
    for side in [-1, 1]:
        bpy.ops.mesh.primitive_cube_add(size=1, location=(side * 0.08, 0.24, 0.98))
        brow = bpy.context.active_object
        brow.name = f"ChaoBrow_{'L' if side < 0 else 'R'}"
        brow.scale = (0.04, 0.01, 0.015)
        brow.rotation_euler = (0.3 if side > 0 else -0.3, 0.2, side * 0.3)
        brow.data.materials.append(create_pupil_material())
        parts.append(brow)
    
    # Ears (small spheres on sides)
    for side in [-1, 1]:
        bpy.ops.mesh.primitive_uv_sphere_add(segments=10, ring_count=8, radius=0.04,
                                             location=(side * 0.18, 0.08, 0.95))
        ear = bpy.context.active_object
        ear.name = f"ChaoEar_{'L' if side < 0 else 'R'}"
        ear.scale = (0.6, 1.0, 1.2)
        ear.data.materials.append(create_chao_skin())
        parts.append(ear)
    
    # Arms (reaching to steering wheel)
    for side in [-1, 1]:
        bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=0.025, depth=0.25,
                                            location=(side * 0.18, 0.15, 0.72),
                                            rotation=(math.radians(45), 0, side * math.radians(20)))
        arm = bpy.context.active_object
        arm.name = f"ChaoArm_{'L' if side < 0 else 'R'}"
        arm.data.materials.append(create_chao_skin())
        parts.append(arm)
        
        # Hands (gripping wheel)
        bpy.ops.mesh.primitive_uv_sphere_add(segments=8, ring_count=6, radius=0.02,
                                             location=(side * 0.12, 0.25, 0.68))
        hand = bpy.context.active_object
        hand.name = f"ChaoHand_{'L' if side < 0 else 'R'}"
        hand.scale = (1.0, 1.2, 0.8)
        hand.data.materials.append(create_chao_skin())
        parts.append(hand)
    
    return parts

def build_interior():
    parts = []
    
    # Driver seat
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.1, 0.35))
    seat = bpy.context.active_object
    seat.name = "Seat"
    seat.scale = (0.4, 0.35, 0.15)
    seat.data.materials.append(bpy.data.materials.new(name="SeatMat"))
    seat.data.materials[0].use_nodes = True
    seat.data.materials[0].node_tree.nodes["Principled BSDF"].inputs['Base Color'].default_value = (0.1, 0.1, 0.12, 1.0)
    parts.append(seat)
    
    # Seat back
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.35, 0.55))
    back = bpy.context.active_object
    back.name = "SeatBack"
    back.scale = (0.4, 0.08, 0.3)
    back.rotation_euler = (math.radians(15), 0, 0)
    back.data.materials.append(seat.data.materials[0])
    parts.append(back)
    
    # Steering wheel
    bpy.ops.mesh.primitive_torus_add(major_segments=24, minor_segments=12,
                                     major_radius=0.12, minor_radius=0.015,
                                     location=(0, 0.25, 0.68), rotation=(math.radians(70), 0, 0))
    wheel = bpy.context.active_object
    wheel.name = "SteeringWheel"
    wheel.data.materials.append(create_rim_material())
    parts.append(wheel)
    
    # Steering column
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.015, depth=0.15,
                                        location=(0, 0.15, 0.62), rotation=(math.radians(70), 0, 0))
    col = bpy.context.active_object
    col.name = "SteeringColumn"
    col.data.materials.append(create_rim_material())
    parts.append(col)
    
    # Dashboard
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.4, 0.55))
    dash = bpy.context.active_object
    dash.name = "Dashboard"
    dash.scale = (0.9, 0.15, 0.12)
    dash.data.materials.append(bpy.data.materials.new(name="DashMat"))
    dash.data.materials[0].use_nodes = True
    dash.data.materials[0].node_tree.nodes["Principled BSDF"].inputs['Base Color'].default_value = (0.05, 0.05, 0.05, 1.0)
    parts.append(dash)
    
    return parts

# ============================================================
# TRACK ENVIRONMENT (Procedural Scatter)
# ============================================================

def build_track_surface():
    # Main track
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, -0.01))
    track = bpy.context.active_object
    track.name = "TrackSurface"
    track.scale = (6.0, 40.0, 1.0)
    
    track.data.materials.append(bpy.data.materials.new(name="TrackMat"))
    mat = track.data.materials[0]
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = (0.08, 0.08, 0.1, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.9
    
    # Add noise for asphalt variation
    noise = nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 200
    noise.inputs['Detail'].default_value = 10
    
    ramp = nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].color = (0.06, 0.06, 0.08, 1.0)
    ramp.color_ramp.elements[1].color = (0.1, 0.1, 0.12, 1.0)
    
    mix = nodes.new('ShaderNodeMixRGB')
    mix.inputs['Fac'].default_value = 0.3
    
    links.new(noise.outputs['Fac'], ramp.inputs['Fac'])
    links.new(ramp.outputs['Color'], mix.inputs['Color2'])
    links.new(mix.outputs['Color'], bsdf.inputs['Base Color'])
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    
    return track

def build_neon_pillars():
    pillars = []
    for i in range(20):
        side = 1 if i % 2 == 0 else -1
        y = -15 + i * 1.5
        x = side * (3.5 + random.uniform(0, 1.5))
        
        # Pillar
        bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.08, depth=2.5,
                                            location=(x, y, 1.25))
        pillar = bpy.context.active_object
        pillar.name = f"NeonPillar_{i}"
        pillar.data.materials.append(create_neon_material(f"PillarNeon_{i}", 
                                                           (0.0, 1.0, 0.8) if side > 0 else (1.0, 0.0, 0.5),
                                                           5.0))
        pillars.append(pillar)
        
        # Light beam (cone pointing down)
        bpy.ops.mesh.primitive_cone_add(vertices=8, radius1=0.3, radius2=0.0, depth=1.5,
                                        location=(x, y, 0.75))
        beam = bpy.context.active_object
        beam.name = f"LightBeam_{i}"
        beam.data.materials.append(bpy.data.materials.new(name=f"BeamMat_{i}"))
        mat = beam.data.materials[0]
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        links = mat.node_tree.links
        nodes.clear()
        
        output = nodes.new('ShaderNodeOutputMaterial')
        emission = nodes.new('ShaderNodeEmission')
        emission.inputs['Color'].default_value = (0.0, 1.0, 0.8, 0.3) if side > 0 else (1.0, 0.0, 0.5, 0.3)
        emission.inputs['Strength'].default_value = 2.0
        
        # Transparent mix
        transparent = nodes.new('ShaderNodeBsdfTransparent')
        mix = nodes.new('ShaderNodeMixShader')
        mix.inputs['Fac'].default_value = 0.7
        
        links.new(emission.outputs['Emission'], mix.inputs[1])
        links.new(transparent.outputs['BSDF'], mix.inputs[2])
        links.new(mix.outputs['Shader'], output.inputs['Surface'])
        
        pillars.append(beam)
    
    return pillars

def build_scattered_rocks():
    rocks = []
    for i in range(30):
        x = random.uniform(-5.5, 5.5)
        y = random.uniform(-18, 18)
        # Keep away from track center
        if abs(x) < 2.5:
            x = 2.5 + abs(x)
        
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=random.uniform(0.05, 0.2),
                                              location=(x, y, 0.1))
        rock = bpy.context.active_object
        rock.name = f"Rock_{i}"
        rock.scale = (random.uniform(0.8, 1.5), random.uniform(0.8, 1.5), random.uniform(0.5, 1.0))
        rock.rotation_euler = (random.uniform(0, 3), random.uniform(0, 3), random.uniform(0, 3))
        
        rock.data.materials.append(bpy.data.materials.new(name=f"RockMat_{i}"))
        mat = rock.data.materials[0]
        mat.use_nodes = True
        mat.node_tree.nodes["Principled BSDF"].inputs['Base Color'].default_value = (0.15, 0.14, 0.13, 1.0)
        mat.node_tree.nodes["Principled BSDF"].inputs['Roughness'].default_value = 0.95
        
        rocks.append(rock)
    
    return rocks

# ============================================================
# ANIMATION (Keyframes for glTF export)
# ============================================================

def add_animation():
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 120
    scene.render.fps = 30
    
    # Engine vibration — car body bob
    car = bpy.data.objects.get("CarBody_v6")
    if car:
        car.location.z = 0.55
        car.keyframe_insert(data_path="location", frame=1)
        car.location.z = 0.57
        car.keyframe_insert(data_path="location", frame=15)
        car.location.z = 0.55
        car.keyframe_insert(data_path="location", frame=30)
        car.location.z = 0.57
        car.keyframe_insert(data_path="location", frame=45)
        car.location.z = 0.55
        car.keyframe_insert(data_path="location", frame=60)
        car.location.z = 0.57
        car.keyframe_insert(data_path="location", frame=75)
        car.location.z = 0.55
        car.keyframe_insert(data_path="location", frame=90)
        car.location.z = 0.57
        car.keyframe_insert(data_path="location", frame=105)
        car.location.z = 0.55
        car.keyframe_insert(data_path="location", frame=120)
        
        # Make linear for mechanical vibration
        if car.animation_data and car.animation_data.action:
            for fcurve in car.animation_data.action.fcurves:
                for kp in fcurve.keyframe_points:
                    kp.interpolation = 'LINEAR'
    
    # Wheel spin
    for side in ['L', 'R']:
        for pos in ['F', 'R']:
            tire = bpy.data.objects.get(f"Tire_{side}{pos}")
            if tire:
                tire.rotation_euler = (math.radians(90), 0, 0)
                tire.keyframe_insert(data_path="rotation_euler", frame=1)
                tire.rotation_euler = (math.radians(90), 0, math.radians(360 * 3))
                tire.keyframe_insert(data_path="rotation_euler", frame=120)
                
                if tire.animation_data and tire.animation_data.action:
                    for fcurve in tire.animation_data.action.fcurves:
                        for kp in fcurve.keyframe_points:
                            kp.interpolation = 'LINEAR'
    
    # Chao breathing (subtle head bob)
    head = bpy.data.objects.get("ChaoHead_v6")
    if head:
        head.location.z = 0.92
        head.keyframe_insert(data_path="location", frame=1)
        head.location.z = 0.935
        head.keyframe_insert(data_path="location", frame=30)
        head.location.z = 0.92
        head.keyframe_insert(data_path="location", frame=60)
        head.location.z = 0.935
        head.keyframe_insert(data_path="location", frame=90)
        head.location.z = 0.92
        head.keyframe_insert(data_path="location", frame=120)
        
        if head.animation_data and head.animation_data.action:
            for fcurve in head.animation_data.action.fcurves:
                for kp in fcurve.keyframe_points:
                    kp.interpolation = 'BEZIER'
    
    # Steering wheel oscillation
    wheel = bpy.data.objects.get("SteeringWheel")
    if wheel:
        wheel.rotation_euler = (math.radians(70), 0, 0)
        wheel.keyframe_insert(data_path="rotation_euler", frame=1)
        wheel.rotation_euler = (math.radians(70), 0, math.radians(20))
        wheel.keyframe_insert(data_path="rotation_euler", frame=20)
        wheel.rotation_euler = (math.radians(70), 0, math.radians(-15))
        wheel.keyframe_insert(data_path="rotation_euler", frame=50)
        wheel.rotation_euler = (math.radians(70), 0, 0)
        wheel.keyframe_insert(data_path="rotation_euler", frame=80)
        wheel.rotation_euler = (math.radians(70), 0, math.radians(10))
        wheel.keyframe_insert(data_path="rotation_euler", frame=100)
        wheel.rotation_euler = (math.radians(70), 0, 0)
        wheel.keyframe_insert(data_path="rotation_euler", frame=120)

# ============================================================
# LIGHTING
# ============================================================

def setup_lighting():
    # Main key light (warm, high)
    bpy.ops.object.light_add(type='AREA', location=(3, 2, 4))
    key = bpy.context.active_object
    key.name = "KeyLight"
    key.data.energy = 150
    key.data.size = 3
    key.data.color = (1.0, 0.95, 0.9)
    
    # Fill light (cool, opposite)
    bpy.ops.object.light_add(type='AREA', location=(-3, -1, 3))
    fill = bpy.context.active_object
    fill.name = "FillLight"
    fill.data.energy = 80
    fill.data.size = 4
    fill.data.color = (0.8, 0.85, 1.0)
    
    # Rim light (from behind, for silhouette)
    bpy.ops.object.light_add(type='AREA', location=(0, -4, 2))
    rim = bpy.context.active_object
    rim.name = "RimLight"
    rim.data.energy = 200
    rim.data.size = 2
    rim.data.color = (1.0, 0.5, 0.8)
    
    # Under glow (neon bounce from track)
    bpy.ops.object.light_add(type='AREA', location=(0, 0, -0.5))
    under = bpy.context.active_object
    under.name = "UnderGlow"
    under.data.energy = 50
    under.data.size = 6
    under.data.color = (0.5, 0.0, 0.5)

# ============================================================
# EXPORT
# ============================================================

def export_scene(filepath):
    # Select all mesh and armature objects
    bpy.ops.object.select_all(action='DESELECT')
    for obj in bpy.context.scene.objects:
        if obj.type in ['MESH', 'ARMATURE', 'LIGHT']:
            obj.select_set(True)
    
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        use_selection=True,
        export_format='GLB',
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
        export_yup=True,
        export_materials='EXPORT',
        export_image_format='WEBP',
        export_animations=True,
        export_animation_mode='ACTIONS',
        export_bake_animation=True,
        export_current_frame=False,
        export_skins=True,
        export_morph=True,
    )
    print(f"Exported: {filepath}")

# ============================================================
# MAIN
# ============================================================

def main():
    clear_scene()
    
    print("Building car body...")
    body = build_car_body()
    
    print("Building spoiler...")
    spoiler_parts = build_car_spoiler()
    
    print("Building wheels...")
    wheels = build_wheels()
    
    print("Building headlights...")
    lights = build_headlights()
    
    print("Building neon strips...")
    neon = build_neon_strips(body)
    
    print("Building Chao character...")
    chao = build_chao_character()
    
    print("Building interior...")
    interior = build_interior()
    
    print("Building track...")
    track = build_track_surface()
    
    print("Building neon pillars...")
    pillars = build_neon_pillars()
    
    print("Building scattered rocks...")
    rocks = build_scattered_rocks()
    
    print("Adding animation...")
    add_animation()
    
    print("Setting up lighting...")
    setup_lighting()
    
    # Apply all modifiers before export (for cleaner file)
    print("Applying modifiers...")
    bpy.ops.object.select_all(action='SELECT')
    for obj in bpy.context.selected_objects:
        if obj.type == 'MESH':
            # Convert to mesh to bake modifiers
            bpy.context.view_layer.objects.active = obj
            for mod in list(obj.modifiers):
                try:
                    bpy.ops.object.modifier_apply(modifier=mod.name)
                except:
                    pass  # Some modifiers can't apply
    
    # Export
    output_path = "/tmp/mad_scene_complete.glb"
    export_scene(output_path)
    
    # Print stats
    mesh_count = len([o for o in bpy.data.objects if o.type == 'MESH'])
    print(f"\n✅ Complete scene built!")
    print(f"   Meshes: {mesh_count}")
    print(f"   Materials: {len(bpy.data.materials)}")
    print(f"   File: {output_path}")

if __name__ == "__main__":
    main()
