import json
import sys

import bpy


illidan_glb = sys.argv[-3]
kassadin_glb = sys.argv[-2]
output_blend = sys.argv[-1]

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()

bpy.ops.import_scene.gltf(filepath=illidan_glb)
for obj in bpy.context.scene.objects:
    if obj.type in {"ARMATURE", "MESH"}:
        obj.name = f"Illidan_{obj.name}"

bpy.ops.import_scene.gltf(filepath=kassadin_glb)
for obj in bpy.context.scene.objects:
    if obj.type == "ARMATURE":
        obj.name = "Illidan_Armature" if obj.name.startswith("Illidan_") else "Kassadin_Armature"

meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
armatures = [obj for obj in bpy.context.scene.objects if obj.type == "ARMATURE"]

bpy.ops.wm.save_as_mainfile(filepath=output_blend)

print(
    json.dumps(
        {
            "blend": output_blend,
            "armatures": [obj.name for obj in armatures],
            "mesh_objects": len(meshes),
            "actions": len(bpy.data.actions),
        }
    )
)
