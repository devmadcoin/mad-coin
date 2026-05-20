import bpy
import math
import os
import sys

# ============================================================
# MAD CAR V5 — ALL TECHNIQUES APPLIED
# Josh Gambrell booleans | Gleb bevels | FlyCat sculpt
# IanHubert lazy cinema | Ducky 3D modifiers | Grease pencil converted
# ============================================================

OUTPUT_PATH = "/tmp/mad_car_v5.glb"
COLL_NAME = "MAD_Car_v5"

# --- Helpers ---
def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for mesh in bpy.data.meshes:
        if mesh.users == 0:
            bpy.data.meshes.remove(mesh)

def set_smooth(obj):
    obj.data.shade_smooth()
    for poly in obj.data.polygons:
        poly.use_smooth = True
    # Enable auto smooth for bevel + weighted normal modifiers
    obj.data.use_auto_smooth = True
    obj.data.auto_smooth_angle = math.radians(30)

def add_material(obj, name, color, metallic=0.0, roughness=0.3, emission=None):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    principled = nodes["Principled BSDF"]
    principled.inputs["Base Color"].default_value = (*color, 1.0)
    principled.inputs["Metallic"].default_value = metallic
    principled.inputs["Roughness"].default_value = roughness
    if emission:
        # Blender 4.0+ uses separate Emission node or Emission Strength input
        # Add emission shader and mix
        emit_node = nodes.new(type='ShaderNodeEmission')
        emit_node.inputs["Color"].default_value = (*emission, 1.0)
        emit_node.inputs["Strength"].default_value = 5.0
        mix_node = nodes.new(type='ShaderNodeMixShader')
        mix_node.inputs["Fac"].default_value = 0.8
        output = nodes["Material Output"]
        # Link: Principled BSDF → mix[1], Emission → mix[2], mix → output
        links.new(principled.outputs["BSDF"], mix_node.inputs[1])
        links.new(emit_node.outputs["Emission"], mix_node.inputs[2])
        links.new(mix_node.outputs["Shader"], output.inputs["Surface"])
    obj.data.materials.append(mat)
    return mat

def create_collection(name):
    if name in bpy.data.collections:
        coll = bpy.data.collections[name]
        for obj in list(coll.objects):
            coll.objects.unlink(obj)
        return coll
    coll = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(coll)
    return coll

def move_to_collection(obj, coll):
    for c in obj.users_collection:
        c.objects.unlink(obj)
    coll.objects.link(obj)

# ============================================================
# TECHNIQUE 1: JOSH GAMBRELL BOOLEAN WORKFLOW
# Panel lines, vents, hood scoop, door seams
# ============================================================

def apply_boolean_cut(base_obj, cutter_obj, operation='DIFFERENCE'):
    """Josh Gambrell style: add boolean modifier, keep live until end"""
    mod = base_obj.modifiers.new(name=f"Boolean_{cutter_obj.name}", type='BOOLEAN')
    mod.operation = operation
    mod.object = cutter_obj
    mod.solver = 'FAST'
    # Hide cutter
    cutter_obj.hide_set(True)
    cutter_obj.hide_render = True
    return mod

def apply_boolean_union(base_obj, add_obj):
    mod = base_obj.modifiers.new(name=f"Boolean_Union_{add_obj.name}", type='BOOLEAN')
    mod.operation = 'UNION'
    mod.object = add_obj
    mod.solver = 'FAST'
    add_obj.hide_set(True)
    add_obj.hide_render = True
    return mod

# ============================================================
# TECHNIQUE 2: GLEB ALEXANDROV BEVEL STACK
# Bevel + Weighted Normals + Subsurf (in that order)
# ============================================================

def add_bevel_stack(obj, width=0.003, segments=3, mark_sharp_edges=True):
    """Gleb Alexandrov bevel stack: Bevel -> Weighted Normal -> (Subsurf)"""
    # 1. Bevel modifier
    bevel = obj.modifiers.new(name="Bevel_Gleb", type='BEVEL')
    bevel.width = width
    bevel.segments = segments
    bevel.limit_method = 'ANGLE'
    bevel.angle_limit = math.radians(30)
    bevel.harden_normals = True
    
    # 2. Weighted Normal modifier
    wn = obj.modifiers.new(name="WeightedNormal", type='WEIGHTED_NORMAL')
    wn.weight = 50
    wn.mode = 'FACE_AREA'
    wn.keep_sharp = True
    
    # 3. Subdivision surface (optional, for render)
    subsurf = obj.modifiers.new(name="Subsurf", type='SUBSURF')
    subsurf.levels = 1
    subsurf.render_levels = 2
    
    # Mark sharp edges for creases
    if mark_sharp_edges:
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='DESELECT')
        # Select edges by angle and mark sharp
        bpy.ops.mesh.select_mode(type='EDGE')
        bpy.ops.mesh.edges_select_sharp(sharpness=math.radians(60))
        bpy.ops.mesh.mark_sharp(clear=False)
        bpy.ops.object.mode_set(mode='OBJECT')
    
    set_smooth(obj)
    return bevel, wn, subsurf

# ============================================================
# TECHNIQUE 3: FLYCAT SCULPT APPROACH
# Organic form building via proportional editing
# ============================================================

def create_sculpted_head(name, location, size=0.15):
    """FlyCat approach: sphere base, proportional edit for organic form"""
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=12, radius=size, location=location)
    head = bpy.context.active_object
    head.name = name
    
    # Enter edit mode for "sculpt-like" manipulation
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    
    # Enable proportional editing (like sculpt grab)
    bpy.context.scene.tool_settings.use_proportional_edit = True
    bpy.context.scene.tool_settings.proportional_edit_falloff = 'SMOOTH'
    bpy.context.scene.tool_settings.proportional_size = 0.3
    
    # Push cheeks forward (like FlyCat grab brush)
    bpy.ops.mesh.select_all(action='DESELECT')
    bpy.ops.object.mode_set(mode='OBJECT')
    
    # Select front vertices for cheek push
    for v in head.data.vertices:
        if v.co.y > size * 0.3 and abs(v.co.x) < size * 0.5:
            v.select = True
    
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.transform.translate(value=(0, size * 0.15, 0), 
                                proportional_edit_falloff='SMOOTH',
                                proportional_size=0.25)
    
    # Flatten top (head shape)
    bpy.ops.mesh.select_all(action='DESELECT')
    bpy.ops.object.mode_set(mode='OBJECT')
    for v in head.data.vertices:
        if v.co.z > size * 0.5:
            v.select = True
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.transform.translate(value=(0, 0, -size * 0.08),
                                proportional_edit_falloff='SMOOTH',
                                proportional_size=0.3)
    
    bpy.ops.object.mode_set(mode='OBJECT')
    bpy.context.scene.tool_settings.use_proportional_edit = False
    
    # Mirror modifier for symmetry (FlyCat retopo approach)
    mirror = head.modifiers.new(name="Mirror", type='MIRROR')
    mirror.use_axis = (True, False, False)
    mirror.use_bisect_axis = (True, False, False)
    
    # Subsurf for organic smoothing
    subsurf = head.modifiers.new(name="Subsurf", type='SUBSURF')
    subsurf.levels = 2
    subsurf.render_levels = 3
    
    set_smooth(head)
    return head

# ============================================================
# TECHNIQUE 4: IAN HUBERT LAZY CINEMA
# Simple geometry, fog, particles, dramatic camera
# ============================================================

def create_lazy_environment(coll):
    """IanHubert style: simple planes + fog = cinematic environment"""
    # Ground plane (neon grid suggestion)
    bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, -0.05))
    ground = bpy.context.active_object
    ground.name = "Ground_Neon"
    add_material(ground, "Ground", (0.02, 0.0, 0.05), emission=(0.8, 0.0, 1.0))
    move_to_collection(ground, coll)
    
    # Fog planes (distance = blur, simple geometry)
    for i in range(3):
        bpy.ops.mesh.primitive_plane_add(size=20 + i*5, location=(0, 0, 2 + i*1.5))
        fog = bpy.context.active_object
        fog.name = f"Fog_{i}"
        # Transparent material for fog
        mat = bpy.data.materials.new(name=f"FogMat_{i}")
        mat.use_nodes = True
        mat.blend_method = 'BLEND'
        principled = mat.node_tree.nodes["Principled BSDF"]
        principled.inputs["Base Color"].default_value = (0.5, 0.0, 1.0, 0.05)
        principled.inputs["Alpha"].default_value = 0.05 + i * 0.02
        fog.data.materials.append(mat)
        fog.hide_render = True  # Just for viewport reference
        move_to_collection(fog, coll)
    
    return ground

# ============================================================
# TECHNIQUE 5: DUCKY 3D MODIFIER STACKS
# Array + Curve + Mirror for repeating elements
# ============================================================

def create_array_spokes(parent_obj, count=8, radius=0.18):
    """Ducky 3D style: Array modifier for radial spokes"""
    bpy.ops.mesh.primitive_cylinder_add(radius=0.01, depth=0.15, location=(0, 0, 0))
    spoke = bpy.context.active_object
    spoke.name = "WheelSpoke"
    
    # Empty for radial array
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
    empty = bpy.context.active_object
    empty.name = "SpokeArrayCenter"
    
    # Array modifier: radial
    array = spoke.modifiers.new(name="RadialArray", type='ARRAY')
    array.count = count
    array.use_relative_offset = False
    array.use_object_offset = True
    array.offset_object = empty
    empty.rotation_euler = (0, 0, 2 * math.pi / count)
    
    # Parent to wheel location
    spoke.parent = parent_obj
    spoke.matrix_parent_inverse = parent_obj.matrix_world.inverted()
    
    add_material(spoke, "Spoke", (0.7, 0.7, 0.7), metallic=0.9, roughness=0.1)
    set_smooth(spoke)
    return spoke

def create_neon_underglow(body_obj, length=2.5):
    """Ducky 3D: Array + Curve for neon strip"""
    # Create curve along car bottom
    curve_data = bpy.data.curves.new(name="UnderglowCurve", type='CURVE')
    curve_data.dimensions = '3D'
    spline = curve_data.splines.new('POLY')
    spline.points.add(3)
    
    # Car bottom profile
    points = [(-1.2, 0.5, -0.2), (-0.5, 0.55, -0.2), (0.5, 0.55, -0.2), (1.2, 0.5, -0.2)]
    for i, (x, y, z) in enumerate(points):
        spline.points[i].co = (x, y, z, 1)
    
    curve_obj = bpy.data.objects.new("UnderglowCurve", curve_data)
    bpy.context.collection.objects.link(curve_obj)
    
    # Create neon tube
    bpy.ops.mesh.primitive_cylinder_add(radius=0.015, depth=0.1, location=(0, 0, 0))
    neon = bpy.context.active_object
    neon.name = "NeonUnderglow"
    neon.rotation_euler = (math.pi / 2, 0, 0)
    
    # Array + Curve modifiers
    array = neon.modifiers.new(name="NeonArray", type='ARRAY')
    array.fit_type = 'FIT_CURVE'
    array.curve = curve_obj
    array.use_relative_offset = True
    array.relative_offset_displace = (0.1, 0, 0)
    
    curve_mod = neon.modifiers.new(name="CurveDeform", type='CURVE')
    curve_mod.object = curve_obj
    curve_mod.deform_axis = 'NEG_X'
    
    add_material(neon, "NeonUnderglow", (0, 0, 0), emission=(1.0, 0.0, 0.5))
    return neon, curve_obj

# ============================================================
# MAIN BUILD FUNCTION
# ============================================================

def build_mad_car_v5():
    clear_scene()
    coll = create_collection(COLL_NAME)
    
    # --------------------------------------------------------
    # CAR BODY — Unified box modeling + Josh Gambrell booleans
    # --------------------------------------------------------
    
    # Base: single cube shaped via vertex manipulation (box modeling)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.6, 0.25))
    body = bpy.context.active_object
    body.name = "CarBody_v5"
    
    # Scale to car proportions
    body.scale = (2.4, 1.0, 0.55)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    
    # Edit mode: shape the body
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    
    # Subdivide for vertex manipulation
    bpy.ops.mesh.subdivide(number_cuts=3)
    
    # Select and manipulate vertices for car silhouette
    bpy.ops.mesh.select_all(action='DESELECT')
    bpy.ops.object.mode_set(mode='OBJECT')
    
    # Hood slope: lower front top vertices
    for v in body.data.vertices:
        x, y, z = v.co
        if x < -0.8 and z > 0.1:
            v.co.z -= 0.08  # Slope hood down
        if x < -1.0 and z > 0:
            v.co.z -= 0.12  # Nose dip
    
    # Windshield rake: raise rear of hood area
    for v in body.data.vertices:
        x, y, z = v.co
        if -0.5 < x < 0.2 and z > 0.15:
            v.co.z += 0.1
            v.co.y += 0.05  # Push back
    
    # Roof bubble: raise center-rear
    for v in body.data.vertices:
        x, y, z = v.co
        if 0.1 < x < 1.2 and abs(y) < 0.3 and z > 0.1:
            v.co.z += 0.12
    
    # Trunk deck: lower rear
    for v in body.data.vertices:
        x, y, z = v.co
        if x > 1.0 and z > 0:
            v.co.z -= 0.05
    
    # Wheel arches: indent at wheel positions
    for v in body.data.vertices:
        x, y, z = v.co
        # Front wheels
        if -1.3 < x < -0.7 and abs(y) > 0.5 and z < 0.1:
            v.co.y *= 0.85
            v.co.z -= 0.05
        # Rear wheels
        if 0.7 < x < 1.3 and abs(y) > 0.5 and z < 0.1:
            v.co.y *= 0.85
            v.co.z -= 0.05
    
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode='OBJECT')
    
    # Mirror modifier for left-right symmetry
    mirror_body = body.modifiers.new(name="MirrorBody", type='MIRROR')
    mirror_body.use_axis = (False, True, False)
    mirror_body.use_bisect_axis = (False, True, False)
    
    # --------------------------------------------------------
    # Josh Gambrell Booleans: Panel lines, hood scoop, vents
    # --------------------------------------------------------
    
    # Panel line: hood center
    bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.2, 0, 0.35))
    hood_line = bpy.context.active_object
    hood_line.name = "HoodPanelLine"
    hood_line.scale = (1.4, 0.005, 0.003)
    apply_boolean_cut(body, hood_line)
    move_to_collection(hood_line, coll)
    
    # Hood scoop (raised)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.6, 0, 0.42))
    scoop = bpy.context.active_object
    scoop.name = "HoodScoop"
    scoop.scale = (0.5, 0.25, 0.06)
    apply_boolean_union(body, scoop)
    move_to_collection(scoop, coll)
    
    # Side vents (front fender)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.9, 0.52, 0.1))
    vent_l = bpy.context.active_object
    vent_l.name = "SideVent_L"
    vent_l.scale = (0.15, 0.02, 0.06)
    apply_boolean_cut(body, vent_l)
    move_to_collection(vent_l, coll)
    
    # Door seam
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0.3, 0.52, 0.15))
    door_seam = bpy.context.active_object
    door_seam.name = "DoorSeam"
    door_seam.scale = (0.02, 0.005, 0.3)
    apply_boolean_cut(body, door_seam)
    move_to_collection(door_seam, coll)
    
    # Headlight recesses
    bpy.ops.mesh.primitive_cylinder_add(radius=1, depth=1, location=(-1.15, 0.35, 0.15))
    hl_recess = bpy.context.active_object
    hl_recess.name = "HeadlightRecess"
    hl_recess.scale = (0.14, 0.03, 0.12)
    hl_recess.rotation_euler = (0, math.pi / 2, 0)
    apply_boolean_cut(body, hl_recess)
    move_to_collection(hl_recess, coll)
    
    # --------------------------------------------------------
    # Gleb Alexandrov Bevel Stack
    # --------------------------------------------------------
    add_bevel_stack(body, width=0.004, segments=3)
    add_material(body, "CarBody", (0.85, 0.05, 0.05), metallic=0.7, roughness=0.15)
    move_to_collection(body, coll)
    
    # --------------------------------------------------------
    # WHEELS — Ducky 3D Array + proper hard-surface
    # --------------------------------------------------------
    
    wheel_positions = [
        (-1.0, 0.52, -0.05),  # Front L
        (-1.0, -0.52, -0.05), # Front R
        (1.0, 0.52, -0.05),   # Rear L
        (1.0, -0.52, -0.05),  # Rear R
    ]
    
    wheels = []
    for i, pos in enumerate(wheel_positions):
        # Wheel well (boolean cut into body)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.22, depth=0.15, location=pos)
        well = bpy.context.active_object
        well.name = f"WheelWell_{i}"
        well.rotation_euler = (0, math.pi / 2, 0)
        apply_boolean_cut(body, well)
        move_to_collection(well, coll)
        
        # Tire
        bpy.ops.mesh.primitive_torus_add(major_radius=0.2, minor_radius=0.08, location=pos)
        tire = bpy.context.active_object
        tire.name = f"Tire_{i}"
        tire.rotation_euler = (math.pi / 2, 0, 0)
        add_material(tire, "Tire", (0.08, 0.08, 0.08), roughness=0.9)
        set_smooth(tire)
        move_to_collection(tire, coll)
        wheels.append(tire)
        
        # Rim
        bpy.ops.mesh.primitive_cylinder_add(radius=0.14, depth=0.06, location=pos)
        rim = bpy.context.active_object
        rim.name = f"Rim_{i}"
        rim.rotation_euler = (0, math.pi / 2, 0)
        add_material(rim, "Rim", (0.6, 0.6, 0.6), metallic=0.95, roughness=0.05)
        
        # Ducky 3D: Array spokes (radial)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.008, depth=0.12, location=pos)
        spoke_master = bpy.context.active_object
        spoke_master.name = f"SpokeMaster_{i}"
        spoke_master.rotation_euler = (0, math.pi / 2, 0)
        
        # Create empty for radial array
        bpy.ops.object.empty_add(type='PLAIN_AXES', location=pos)
        spoke_empty = bpy.context.active_object
        spoke_empty.name = f"SpokeEmpty_{i}"
        
        array = spoke_master.modifiers.new(name="RadialSpokes", type='ARRAY')
        array.count = 5
        array.use_relative_offset = False
        array.use_object_offset = True
        array.offset_object = spoke_empty
        spoke_empty.rotation_euler = (0, 0, 2 * math.pi / 5)
        
        add_material(spoke_master, "Spoke", (0.7, 0.7, 0.7), metallic=0.9, roughness=0.1)
        move_to_collection(spoke_master, coll)
        move_to_collection(spoke_empty, coll)
        move_to_collection(rim, coll)
    
    # --------------------------------------------------------
    # INTERIOR — Seats, steering wheel, dashboard
    # --------------------------------------------------------
    
    # Driver seat
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0.3, 0.25, 0.15))
    seat = bpy.context.active_object
    seat.name = "DriverSeat"
    seat.scale = (0.25, 0.22, 0.08)
    add_material(seat, "Seat", (0.1, 0.1, 0.1), roughness=0.8)
    move_to_collection(seat, coll)
    
    # Seat back
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0.15, 0.25, 0.35))
    seat_back = bpy.context.active_object
    seat_back.name = "SeatBack"
    seat_back.scale = (0.08, 0.22, 0.25)
    seat_back.rotation_euler = (0.1, 0, 0)
    add_material(seat_back, "SeatBack", (0.1, 0.1, 0.1), roughness=0.8)
    move_to_collection(seat_back, coll)
    
    # Steering wheel (torus)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.06, minor_radius=0.008, location=(0.55, 0.22, 0.45))
    steering = bpy.context.active_object
    steering.name = "SteeringWheel"
    steering.rotation_euler = (0.3, 0, 0)
    add_material(steering, "Steering", (0.05, 0.05, 0.05), metallic=0.3, roughness=0.4)
    set_smooth(steering)
    move_to_collection(steering, coll)
    
    # Steering column
    bpy.ops.mesh.primitive_cylinder_add(radius=0.008, depth=0.15, location=(0.5, 0.22, 0.35))
    steer_col = bpy.context.active_object
    steer_col.name = "SteeringColumn"
    steer_col.rotation_euler = (0.5, 0, 0)
    add_material(steer_col, "SteeringCol", (0.1, 0.1, 0.1), metallic=0.5)
    move_to_collection(steer_col, coll)
    
    # Dashboard
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0.6, 0, 0.42))
    dash = bpy.context.active_object
    dash.name = "Dashboard"
    dash.scale = (0.5, 0.4, 0.05)
    dash.rotation_euler = (0.2, 0, 0)
    add_material(dash, "Dash", (0.05, 0.05, 0.05), roughness=0.7)
    move_to_collection(dash, coll)
    
    # Ducky 3D: Array for dashboard gauges
    bpy.ops.mesh.primitive_cylinder_add(radius=0.02, depth=0.01, location=(0.5, -0.05, 0.47))
    gauge = bpy.context.active_object
    gauge.name = "GaugeMaster"
    gauge.rotation_euler = (0.3, 0, 0)
    
    array_gauge = gauge.modifiers.new(name="GaugeArray", type='ARRAY')
    array_gauge.count = 3
    array_gauge.relative_offset_displace = (0.0, 0.06, 0)
    
    add_material(gauge, "Gauge", (0, 0, 0), emission=(0.5, 0.8, 1.0))
    move_to_collection(gauge, coll)
    
    # --------------------------------------------------------
    # MAD CHAO CHARACTER — FlyCat sculpt approach
    # --------------------------------------------------------
    
    # Driver position
    chao_body_pos = (0.3, 0.22, 0.32)
    
    # Sculpted head (FlyCat technique)
    head = create_sculpted_head("ChaoHead_v5", (0.32, 0.22, 0.5), size=0.09)
    add_material(head, "ChaoHead", (0.9, 0.1, 0.1))
    move_to_collection(head, coll)
    
    # Body (sphere, scaled)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=10, radius=0.08, location=chao_body_pos)
    chao_body = bpy.context.active_object
    chao_body.name = "ChaoBody_v5"
    chao_body.scale = (0.9, 1.0, 1.1)
    add_material(chao_body, "ChaoBody", (0.9, 0.1, 0.1))
    
    # Subsurf for organic look
    chao_sub = chao_body.modifiers.new(name="ChaoSubsurf", type='SUBSURF')
    chao_sub.levels = 2
    set_smooth(chao_body)
    move_to_collection(chao_body, coll)
    
    # Arms (to steering wheel)
    for side in [1, -1]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.02, depth=0.12, location=(0.42, 0.22 + side * 0.04, 0.38))
        arm = bpy.context.active_object
        arm.name = f"ChaoArm_{side}"
        arm.rotation_euler = (0, 0.5, side * 0.3)
        add_material(arm, f"ChaoArm_{side}", (0.9, 0.1, 0.1))
        move_to_collection(arm, coll)
    
    # Eyes (separate geometry — proper topology)
    for side in [1, -1]:
        # Eye white
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.025, location=(0.34, 0.22 + side * 0.04, 0.52))
        eye_white = bpy.context.active_object
        eye_white.name = f"EyeWhite_{side}"
        eye_white.scale = (0.6, 1.0, 1.0)
        add_material(eye_white, f"EyeWhite_{side}", (1.0, 1.0, 1.0))
        set_smooth(eye_white)
        move_to_collection(eye_white, coll)
        
        # Pupil
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.012, location=(0.36, 0.22 + side * 0.04, 0.52))
        pupil = bpy.context.active_object
        pupil.name = f"Pupil_{side}"
        add_material(pupil, f"Pupil_{side}", (0, 0, 0))
        set_smooth(pupil)
        move_to_collection(pupil, coll)
    
    # Ears (small cones)
    for side in [1, -1]:
        bpy.ops.mesh.primitive_cone_add(radius1=0.015, radius2=0.005, depth=0.03, location=(0.28, 0.22 + side * 0.1, 0.55))
        ear = bpy.context.active_object
        ear.name = f"ChaoEar_{side}"
        ear.rotation_euler = (0.5, 0, side * 0.5)
        add_material(ear, f"ChaoEar_{side}", (0.9, 0.1, 0.1))
        move_to_collection(ear, coll)
    
    # --------------------------------------------------------
    # HOOD MASCOT — Co-pilot
    # --------------------------------------------------------
    
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.05, location=(-0.7, 0, 0.6))
    hood_head = bpy.context.active_object
    hood_head.name = "HoodMascotHead"
    add_material(hood_head, "HoodHead", (0.9, 0.1, 0.1))
    
    hood_sub = hood_head.modifiers.new(name="HoodSub", type='SUBSURF')
    hood_sub.levels = 2
    set_smooth(hood_head)
    move_to_collection(hood_head, coll)
    
    # Hood mascot body
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.04, location=(-0.7, 0, 0.52))
    hood_body = bpy.context.active_object
    hood_body.name = "HoodMascotBody"
    hood_body.scale = (0.8, 1.0, 1.2)
    add_material(hood_body, "HoodBody", (0.9, 0.1, 0.1))
    move_to_collection(hood_body, coll)
    
    # Hood mascot eyes
    for side in [1, -1]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.015, location=(-0.66, side * 0.02, 0.62))
        h_eye = bpy.context.active_object
        h_eye.name = f"HoodEye_{side}"
        add_material(h_eye, f"HoodEye_{side}", (0, 0, 0))
        set_smooth(h_eye)
        move_to_collection(h_eye, coll)
    
    # --------------------------------------------------------
    # SPOILER — Hard surface with booleans
    # --------------------------------------------------------
    
    # Main wing
    bpy.ops.mesh.primitive_cube_add(size=1, location=(1.4, 0, 0.55))
    wing = bpy.context.active_object
    wing.name = "SpoilerWing"
    wing.scale = (0.08, 0.7, 0.02)
    add_material(wing, "Spoiler", (0.1, 0.1, 0.1), metallic=0.3, roughness=0.3)
    
    # Bevel for soft edges
    wing_bevel = wing.modifiers.new(name="WingBevel", type='BEVEL')
    wing_bevel.width = 0.002
    wing_bevel.segments = 2
    set_smooth(wing)
    move_to_collection(wing, coll)
    
    # Endplates (boolean unions)
    for side in [1, -1]:
        bpy.ops.mesh.primitive_cube_add(size=1, location=(1.4, side * 0.7, 0.5))
        endplate = bpy.context.active_object
        endplate.name = f"Endplate_{side}"
        endplate.scale = (0.15, 0.02, 0.12)
        apply_boolean_union(wing, endplate)
        move_to_collection(endplate, coll)
    
    # Struts
    for side in [1, -1]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.015, depth=0.15, location=(1.4, side * 0.4, 0.45))
        strut = bpy.context.active_object
        strut.name = f"SpoilerStrut_{side}"
        add_material(strut, f"Strut_{side}", (0.1, 0.1, 0.1), metallic=0.5)
        move_to_collection(strut, coll)
    
    # --------------------------------------------------------
    # HEADLIGHTS — Emissive cylinders in recesses
    # --------------------------------------------------------
    
    for side in [1, -1]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.1, depth=0.02, location=(-1.18, side * 0.35, 0.15))
        headlight = bpy.context.active_object
        headlight.name = f"Headlight_{side}"
        headlight.rotation_euler = (0, math.pi / 2, 0)
        headlight.scale = (1.0, 0.8, 1.0)
        add_material(headlight, f"Headlight_{side}", (0, 0, 0), emission=(1.0, 1.0, 0.9))
        set_smooth(headlight)
        move_to_collection(headlight, coll)
        
        # LED strip inside
        bpy.ops.mesh.primitive_cube_add(size=1, location=(-1.17, side * 0.35, 0.15))
        led = bpy.context.active_object
        led.name = f"LED_{side}"
        led.scale = (0.01, 0.06, 0.01)
        add_material(led, f"LED_{side}", (0, 0, 0), emission=(1.0, 1.0, 1.0))
        move_to_collection(led, coll)
    
    # --------------------------------------------------------
    # TAILLIGHTS — Red emissive strips
    # --------------------------------------------------------
    
    bpy.ops.mesh.primitive_cube_add(size=1, location=(1.22, 0, 0.22))
    tail = bpy.context.active_object
    tail.name = "Taillight"
    tail.scale = (0.02, 0.5, 0.06)
    add_material(tail, "Taillight", (0, 0, 0), emission=(1.0, 0.0, 0.1))
    move_to_collection(tail, coll)
    
    # --------------------------------------------------------
    # EXHAUST — Dual pipes with glow
    # --------------------------------------------------------
    
    for side in [1, -1]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.12, location=(1.25, side * 0.3, 0.05))
        pipe = bpy.context.active_object
        pipe.name = f"Exhaust_{side}"
        pipe.rotation_euler = (0, math.pi / 2, 0)
        add_material(pipe, f"Exhaust_{side}", (0.15, 0.15, 0.15), metallic=0.8, roughness=0.2)
        move_to_collection(pipe, coll)
        
        # Exhaust glow
        bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.02, location=(1.31, side * 0.3, 0.05))
        glow = bpy.context.active_object
        glow.name = f"ExhaustGlow_{side}"
        glow.rotation_euler = (0, math.pi / 2, 0)
        add_material(glow, f"ExhaustGlow_{side}", (0, 0, 0), emission=(1.0, 0.4, 0.0))
        move_to_collection(glow, coll)
    
    # --------------------------------------------------------
    # Ducky 3D: Neon underglow (Array + Curve)
    # --------------------------------------------------------
    
    neon, _ = create_neon_underglow(body, length=2.4)
    move_to_collection(neon, coll)
    
    # Side skirt neon strips
    for side in [1, -1]:
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, side * 0.52, -0.1))
        skirt = bpy.context.active_object
        skirt.name = f"SideNeon_{side}"
        skirt.scale = (1.8, 0.015, 0.015)
        add_material(skirt, f"SideNeon_{side}", (0, 0, 0), emission=(1.0, 0.0, 0.5))
        move_to_collection(skirt, coll)
    
    # --------------------------------------------------------
    # IanHubert: Lazy environment (simple, cinematic)
    # --------------------------------------------------------
    
    ground = create_lazy_environment(coll)
    
    # Track lines (simple neon strips — lazy approach)
    for i in range(5):
        bpy.ops.mesh.primitive_plane_add(size=1, location=(0, (i - 2) * 3, -0.02))
        track = bpy.context.active_object
        track.name = f"TrackLine_{i}"
        track.scale = (30, 0.05, 1)
        intensity = 0.5 + i * 0.2
        add_material(track, f"Track_{i}", (0, 0, 0), 
                    emission=(intensity, 0.0, intensity * 0.5))
        move_to_collection(track, coll)
    
    # --------------------------------------------------------
    # Grease Pencil converted: Speed lines (mesh strips)
    # --------------------------------------------------------
    
    # Speed lines behind car (3D mesh strips angled back)
    for i in range(6):
        angle = (i - 2.5) * 0.3
        bpy.ops.mesh.primitive_plane_add(size=1, location=(2.5 + i * 0.3, angle * 0.5, 0.3 + i * 0.05))
        speed = bpy.context.active_object
        speed.name = f"SpeedLine_{i}"
        speed.scale = (0.3, 0.02, 1)
        speed.rotation_euler = (0, 0, angle)
        
        # Transparent speed line material
        mat = bpy.data.materials.new(name=f"SpeedMat_{i}")
        mat.use_nodes = True
        mat.blend_method = 'BLEND'
        principled = mat.node_tree.nodes["Principled BSDF"]
        principled.inputs["Base Color"].default_value = (1.0, 0.5, 0.0, 0.3)
        principled.inputs["Alpha"].default_value = 0.3
        speed.data.materials.append(mat)
        
        move_to_collection(speed, coll)
    
    # "MAD" text block (simple geometry)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(-1.5, 0, 1.5))
    mad_text = bpy.context.active_object
    mad_text.name = "MAD_Logo"
    mad_text.scale = (0.6, 0.15, 0.05)
    add_material(mad_text, "MAD_Logo", (0, 0, 0), emission=(1.0, 0.0, 0.0))
    move_to_collection(mad_text, coll)
    
    # --------------------------------------------------------
    # LIGHTING — Bright for Three.js
    # --------------------------------------------------------
    
    # Key light
    bpy.ops.object.light_add(type='SUN', location=(5, 5, 8))
    sun = bpy.context.active_object
    sun.name = "Sun_Key"
    sun.data.energy = 8.0
    sun.data.angle = math.radians(15)
    
    # Fill
    bpy.ops.object.light_add(type='AREA', location=(-4, -3, 4))
    fill = bpy.context.active_object
    fill.name = "Fill_Light"
    fill.data.energy = 4.0
    fill.data.size = 4
    
    # Rim for red car definition
    bpy.ops.object.light_add(type='AREA', location=(0, -5, 2))
    rim = bpy.context.active_object
    rim.name = "Rim_Light"
    rim.data.energy = 5.0
    rim.data.size = 6
    rim.data.color = (0.8, 0.9, 1.0)
    
    # Neon bounce
    bpy.ops.object.light_add(type='AREA', location=(0, 0, -2))
    bounce = bpy.context.active_object
    bounce.name = "NeonBounce"
    bounce.data.energy = 3.0
    bounce.data.size = 10
    bounce.data.color = (1.0, 0.0, 0.5)
    
    # Move lights to collection
    for light in [sun, fill, rim, bounce]:
        move_to_collection(light, coll)
    
    # --------------------------------------------------------
    # EXPORT
    # --------------------------------------------------------
    
    # Only export collection objects
    bpy.ops.object.select_all(action='DESELECT')
    for obj in coll.objects:
        obj.select_set(True)
    
    bpy.ops.export_scene.gltf(
        filepath=OUTPUT_PATH,
        use_selection=True,
        export_format='GLB',
        export_yup=True,
        export_materials='EXPORT',
        export_image_format='WEBP',
        export_draco_mesh_compression_enable=True,
        export_draco_position_quantization=14,
        export_tangents=True,
        export_normals=True,
        export_animations=False,
    )
    
    # File size
    size = os.path.getsize(OUTPUT_PATH)
    print(f"\n{'='*50}")
    print(f"MAD CAR V5 EXPORTED")
    print(f"Path: {OUTPUT_PATH}")
    print(f"Size: {size / 1024:.1f} KB")
    print(f"Collection: {COLL_NAME}")
    print(f"Objects: {len(coll.objects)}")
    print(f"\nTechniques applied:")
    print(f"  ✓ Josh Gambrell: Boolean panel lines, vents, scoop")
    print(f"  ✓ Gleb Alexandrov: Bevel + Weighted Normal stacks")
    print(f"  ✓ FlyCat: Sculpted Chao head, organic forms")
    print(f"  ✓ IanHubert: Lazy environment, fog, simple neon")
    print(f"  ✓ Ducky 3D: Array spokes, neon underglow array+curve")
    print(f"  ✓ Grease Pencil: Speed lines (mesh strips)")
    print(f"{'='*50}")
    
    return OUTPUT_PATH, size

if __name__ == "__main__":
    build_mad_car_v5()
