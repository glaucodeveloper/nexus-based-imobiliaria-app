import os
import sys

import bpy


WORK_DIR = r"F:\kassadin_illidan_swap_work"
AVENTURINE_PARENT = os.path.join(WORK_DIR, "tools", "aventurine")
OUT_DIR = os.path.join(WORK_DIR, "exported_anm")
ARMATURE_NAME = "Kassadin_Armature"

ACTION_NAMES = [
    "Animation_Attack1",
    "Animation_Attack2",
    "Animation_Spell1",
    "Animation_Spell2",
    "Animation_Spell3",
    "Animation_Spell4",
    "Animation_Run",
    "Animation_Idle1",
    "Animation_Idle2",
    "Animation_StandReady",
    "Animation_Death1",
]


def main():
    sys.path.insert(0, AVENTURINE_PARENT)
    from Aventurine.io import export_anm

    os.makedirs(OUT_DIR, exist_ok=True)
    armature = bpy.data.objects.get(ARMATURE_NAME)
    if armature is None:
        raise RuntimeError(f"Armature not found: {ARMATURE_NAME}")
    armature.animation_data_create()

    exported = []
    for action_name in ACTION_NAMES:
        action = bpy.data.actions.get(action_name)
        if action is None:
            print(f"[missing] {action_name}")
            continue

        armature.animation_data.action = action
        path = os.path.join(OUT_DIR, action_name + ".anm")
        export_anm.write_anm(
            path,
            armature,
            fps=bpy.context.scene.render.fps or 30.0,
            disable_scaling=False,
            disable_transforms=False,
            flip=False,
            clean_names=True,
            anim_scale=1.0,
            apply_object_transform=True,
        )
        exported.append(path)
        print(f"[anm] {path}")

    print(f"[done] exported {len(exported)} anm files to {OUT_DIR}")


if __name__ == "__main__":
    main()
