import json
import os
import re
import sys

import bpy


def norm(value):
    name = os.path.splitext(os.path.basename(value))[0].lower()
    return re.sub(r"[^a-z0-9]+", "", name)


base = sys.argv[-2]
output = sys.argv[-1]
files = [name for name in os.listdir(base) if name.lower().endswith(".dds")]
file_map = {norm(name): os.path.join(base, name) for name in files}
assigned = []
failed = []

for mat in bpy.data.materials:
    key = norm(mat.name)
    match = None

    for file_key, file_path in file_map.items():
        if key and (key in file_key or file_key in key):
            match = file_path
            break

    if not match:
        continue

    try:
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        bsdf = nodes.get("Principled BSDF")
        tex = nodes.new(type="ShaderNodeTexImage")
        tex.image = bpy.data.images.load(match, check_existing=True)
        mat.node_tree.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
        assigned.append([mat.name, os.path.basename(match)])
    except Exception as exc:
        failed.append([mat.name, os.path.basename(match), str(exc)])

bpy.ops.wm.save_as_mainfile(filepath=output)
print(json.dumps({"assigned": assigned, "failed": failed, "output": output}))
