import json
import sys

import bpy


illidan_glb = sys.argv[-4]
kassadin_glb = sys.argv[-3]
output_blend = sys.argv[-2]
output_glb = sys.argv[-1]

NORMAL_ILLIDAN_PARTS = (
    ":main_geo",
    ":hair_geo",
    ":weapon_01_geo",
    ":weapon_02_geo",
)


def import_gltf(filepath, prefix):
    before = set(bpy.context.scene.objects)
    bpy.ops.import_scene.gltf(filepath=filepath)
    imported = [obj for obj in bpy.context.scene.objects if obj not in before]
    for obj in imported:
        if obj.type in {"ARMATURE", "MESH"}:
            obj.name = f"{prefix}_{obj.name}"
    return imported


def select_active(active, selected):
    bpy.ops.object.mode_set(mode="OBJECT") if bpy.ops.object.mode_set.poll() else None
    bpy.ops.object.select_all(action="DESELECT")
    for obj in selected:
        obj.select_set(True)
    active.select_set(True)
    bpy.context.view_layer.objects.active = active


def remove_armature_modifiers(mesh):
    for modifier in list(mesh.modifiers):
        if modifier.type == "ARMATURE":
            mesh.modifiers.remove(modifier)


def ensure_groups_from_source(target, source):
    target.vertex_groups.clear()
    for group in source.vertex_groups:
        target.vertex_groups.new(name=group.name)


def transfer_weights(target, source):
    ensure_groups_from_source(target, source)
    select_active(target, [source, target])
    bpy.ops.object.data_transfer(
        data_type="VGROUP_WEIGHTS",
        use_create=False,
        vert_mapping="POLYINTERP_NEAREST",
        layers_select_src="ALL",
        layers_select_dst="NAME",
        mix_mode="REPLACE",
    )


def has_any_weights(mesh):
    return any(vertex.groups for vertex in mesh.data.vertices)


def add_armature(mesh, armature):
    mesh.parent = armature
    modifier = mesh.modifiers.new("Kassadin_Armature", "ARMATURE")
    modifier.object = armature


bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()

illidan_objects = import_gltf(illidan_glb, "Illidan")
illidan_actions = list(bpy.data.actions)
kassadin_objects = import_gltf(kassadin_glb, "Kassadin")

kassadin_armature = next(obj for obj in kassadin_objects if obj.type == "ARMATURE")
kassadin_armature.name = "Kassadin_Armature"
kassadin_mesh = max(
    [obj for obj in kassadin_objects if obj.type == "MESH"],
    key=lambda obj: len(obj.data.vertices),
)
kassadin_mesh.name = "Kassadin_Weight_Source"

illidan_meshes_all = [obj for obj in illidan_objects if obj.type == "MESH"]
illidan_meshes = [
    obj
    for obj in illidan_meshes_all
    if any(part in obj.name for part in NORMAL_ILLIDAN_PARTS)
    and ":df_" not in obj.name
    and "Icosphere" not in obj.name
]

for obj in illidan_objects:
    if obj.type == "ARMATURE":
        bpy.data.objects.remove(obj, do_unlink=True)

for obj in illidan_meshes_all:
    if obj not in illidan_meshes:
        bpy.data.objects.remove(obj, do_unlink=True)

for action in illidan_actions:
    bpy.data.actions.remove(action, do_unlink=True)

report = []
for mesh in illidan_meshes:
    remove_armature_modifiers(mesh)
    transfer_weights(mesh, kassadin_mesh)
    add_armature(mesh, kassadin_armature)
    mesh.name = f"Illidan_On_KassadinRig_{mesh.name}"
    report.append(
        {
            "mesh": mesh.name,
            "verts": len(mesh.data.vertices),
            "groups": len(mesh.vertex_groups),
            "has_weights": has_any_weights(mesh),
        }
    )

# Keep Kassadin as a side-by-side reference in the blend only.
for obj in kassadin_objects:
    if obj.type == "MESH":
        obj.name = f"Kassadin_Reference_{obj.name}"
        obj.location.x += 350

bpy.ops.wm.save_as_mainfile(filepath=output_blend)

bpy.ops.object.select_all(action="DESELECT")
for obj in [kassadin_armature, *illidan_meshes]:
    obj.select_set(True)
bpy.context.view_layer.objects.active = kassadin_armature
bpy.ops.export_scene.gltf(
    filepath=output_glb,
    export_format="GLB",
    use_selection=True,
    export_animation_mode="ACTIONS",
)

print(
    json.dumps(
        {
            "blend": output_blend,
            "glb": output_glb,
            "kassadin_armature": kassadin_armature.name,
            "source_mesh": kassadin_mesh.name,
            "illidan_meshes": report,
            "actions": len(bpy.data.actions),
        },
        ensure_ascii=False,
    )
)
