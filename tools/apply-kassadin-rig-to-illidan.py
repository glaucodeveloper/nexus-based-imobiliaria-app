import json
import sys

import bpy
from mathutils import Vector


illidan_glb = sys.argv[-4]
kassadin_glb = sys.argv[-3]
output_blend = sys.argv[-2]
output_glb = sys.argv[-1]


def import_gltf(filepath, prefix):
    before = set(bpy.context.scene.objects)
    bpy.ops.import_scene.gltf(filepath=filepath)
    imported = [obj for obj in bpy.context.scene.objects if obj not in before]
    for obj in imported:
        if obj.type in {"ARMATURE", "MESH"}:
            obj.name = f"{prefix}_{obj.name}"
    return imported


def select_only(objects, active):
    bpy.ops.object.mode_set(mode="OBJECT") if bpy.ops.object.mode_set.poll() else None
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    active.select_set(True)
    bpy.context.view_layer.objects.active = active


def ensure_armature_modifier(mesh, armature):
    modifier = next((mod for mod in mesh.modifiers if mod.type == "ARMATURE"), None)
    if modifier is None:
        modifier = mesh.modifiers.new("Kassadin_Armature", "ARMATURE")
    modifier.object = armature
    mesh.parent = armature


def has_any_weights(mesh):
    if not mesh.vertex_groups:
        return False
    for vertex in mesh.data.vertices:
        if vertex.groups:
            return True
    return False


def fallback_nearest_bone_weights(mesh, armature):
    bones = list(armature.data.bones)
    if not bones:
        return 0

    group_by_name = {group.name: group for group in mesh.vertex_groups}
    for bone in bones:
        if bone.name not in group_by_name:
            group_by_name[bone.name] = mesh.vertex_groups.new(name=bone.name)

    bone_positions = [
        (bone.name, armature.matrix_world @ bone.head_local)
        for bone in bones
    ]

    assigned = 0
    for vertex in mesh.data.vertices:
        world_pos = mesh.matrix_world @ vertex.co
        nearest_name, _ = min(
            bone_positions,
            key=lambda item: (world_pos - item[1]).length_squared,
        )
        group_by_name[nearest_name].add([vertex.index], 1.0, "REPLACE")
        assigned += 1

    return assigned


bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()

illidan_objects = import_gltf(illidan_glb, "Illidan")
illidan_actions = list(bpy.data.actions)
kassadin_objects = import_gltf(kassadin_glb, "Kassadin")
kassadin_actions = [action for action in bpy.data.actions if action not in illidan_actions]

illidan_armatures = [obj for obj in illidan_objects if obj.type == "ARMATURE"]
kassadin_armatures = [obj for obj in kassadin_objects if obj.type == "ARMATURE"]
illidan_meshes = [obj for obj in illidan_objects if obj.type == "MESH"]
kassadin_meshes = [obj for obj in kassadin_objects if obj.type == "MESH"]

if not kassadin_armatures:
    raise RuntimeError("Kassadin armature not found.")

kassadin_armature = kassadin_armatures[0]
kassadin_armature.name = "Kassadin_Armature"

for armature in illidan_armatures:
    armature.name = "Illidan_Original_Armature"
    bpy.data.objects.remove(armature, do_unlink=True)

for action in illidan_actions:
    if action.users == 0 or action not in kassadin_actions:
        bpy.data.actions.remove(action, do_unlink=True)

for mesh in kassadin_meshes:
    mesh.name = f"Kassadin_Reference_{mesh.name}"

for mesh in illidan_meshes:
    mesh.name = f"Illidan_KassadinRig_{mesh.name}"
    mesh.parent = None
    for modifier in list(mesh.modifiers):
        if modifier.type == "ARMATURE":
            mesh.modifiers.remove(modifier)
    mesh.vertex_groups.clear()

bound = []
failed = []

for mesh in illidan_meshes:
    try:
        select_only([mesh], kassadin_armature)
        bpy.ops.object.parent_set(type="ARMATURE_AUTO")
        bound.append(mesh.name)
    except Exception as exc:
        failed.append([mesh.name, str(exc)])
        ensure_armature_modifier(mesh, kassadin_armature)

fallback_weighted = []
for mesh in illidan_meshes:
    ensure_armature_modifier(mesh, kassadin_armature)
    if not has_any_weights(mesh):
        count = fallback_nearest_bone_weights(mesh, kassadin_armature)
        fallback_weighted.append([mesh.name, count])

# Keep the Kassadin model as an in-scene reference, but out of the way visually.
for mesh in kassadin_meshes:
    mesh.location.x += 350

bpy.ops.wm.save_as_mainfile(filepath=output_blend)

bpy.ops.object.select_all(action="DESELECT")
for obj in [kassadin_armature, *illidan_meshes]:
    obj.select_set(True)
bpy.context.view_layer.objects.active = kassadin_armature
bpy.ops.export_scene.gltf(filepath=output_glb, export_format="GLB", use_selection=True, export_animation_mode="ACTIONS")

print(
    json.dumps(
        {
            "blend": output_blend,
            "glb": output_glb,
            "kassadin_armature": kassadin_armature.name,
            "illidan_meshes_bound": len(bound),
            "bind_failures": failed,
            "fallback_weighted": fallback_weighted,
            "kassadin_reference_meshes": len(kassadin_meshes),
            "actions": len(bpy.data.actions),
        },
        ensure_ascii=False,
    )
)
