const fs = require('fs');
const path = require('path');
const { parseMDX } = require('war3-model');

const input = process.argv[2];
const output = process.argv[3] || input?.replace(/\.mdx$/i, '_animated.glb');

if (!input || !output) {
  console.error('Usage: node tools/mdx-to-animated-glb.cjs input.mdx output.glb');
  process.exit(1);
}

function align4(buffer) {
  const pad = (4 - (buffer.length % 4)) % 4;
  return pad ? Buffer.concat([buffer, Buffer.alloc(pad)]) : buffer;
}

function alignJson(buffer) {
  const pad = (4 - (buffer.length % 4)) % 4;
  return pad ? Buffer.concat([buffer, Buffer.alloc(pad, 0x20)]) : buffer;
}

function componentType(typedArray) {
  if (typedArray instanceof Float32Array) return 5126;
  if (typedArray instanceof Uint32Array) return 5125;
  if (typedArray instanceof Uint16Array) return 5123;
  if (typedArray instanceof Uint8Array) return 5121;
  throw new Error(`Unsupported typed array: ${typedArray.constructor.name}`);
}

function writeArray(gltf, chunks, typedArray, target) {
  const source = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
  const offset = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  chunks.push(align4(source));
  const bufferView = gltf.bufferViews.length;
  const view = { buffer: 0, byteOffset: offset, byteLength: source.length };
  if (target) view.target = target;
  gltf.bufferViews.push(view);
  return bufferView;
}

function accessor(gltf, bufferView, typedArray, type, min, max, normalized = false) {
  const components = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 }[type];
  const entry = {
    bufferView,
    byteOffset: 0,
    componentType: componentType(typedArray),
    count: typedArray.length / components,
    type,
  };
  if (normalized) entry.normalized = true;
  if (min && max) {
    entry.min = min;
    entry.max = max;
  }
  const index = gltf.accessors.length;
  gltf.accessors.push(entry);
  return index;
}

function minMax(values, size) {
  const min = Array(size).fill(Infinity);
  const max = Array(size).fill(-Infinity);
  for (let i = 0; i < values.length; i += size) {
    for (let j = 0; j < size; j += 1) {
      const value = values[i + j];
      if (value < min[j]) min[j] = value;
      if (value > max[j]) max[j] = value;
    }
  }
  return { min, max };
}

function v3(value) {
  return [value?.[0] || 0, value?.[1] || 0, value?.[2] || 0];
}

function wc3ToGltfVec3Array(source) {
  const out = new Float32Array(source.length);
  for (let i = 0; i < source.length; i += 3) {
    out[i] = source[i];
    out[i + 1] = source[i + 2];
    out[i + 2] = -source[i + 1];
  }
  return out;
}

function wc3ToGltfVec3(value) {
  return [value[0], value[2], -value[1]];
}

function wc3ToGltfQuat(value) {
  return [value[0], value[2], -value[1], value[3]];
}

function flipUv(source) {
  const out = new Float32Array(source.length);
  const noFlip = process.env.MDX_GLTF_NO_UV_FLIP === '1';
  for (let i = 0; i < source.length; i += 2) {
    out[i] = source[i];
    out[i + 1] = noFlip ? source[i + 1] : 1 - source[i + 1];
  }
  return out;
}

function materialName(model, materialId) {
  const layer = model.Materials?.[materialId]?.Layers?.[0];
  const textureId = typeof layer?.TextureID === 'number' ? layer.TextureID : null;
  const image = textureId !== null ? model.Textures?.[textureId]?.Image : null;
  return image || `Material_${materialId}`;
}

function materialColor(index) {
  const palette = [
    [0.55, 0.60, 0.62, 1],
    [0.25, 0.42, 0.72, 1],
    [0.72, 0.62, 0.25, 1],
    [0.55, 0.25, 0.22, 1],
    [0.35, 0.62, 0.38, 1],
    [0.62, 0.40, 0.70, 1],
  ];
  return palette[index % palette.length];
}

function makeGlb(gltf, binary) {
  const json = alignJson(Buffer.from(JSON.stringify(gltf), 'utf8'));
  const bin = align4(binary);
  const totalLength = 12 + 8 + json.length + 8 + bin.length;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(totalLength, 8);
  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(json.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(bin.length, 0);
  binHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, jsonHeader, json, binHeader, bin]);
}

function identityMat4() {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

function translationMat4(t) {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1].map((v, i) => {
    if (i === 12) return t[0];
    if (i === 13) return t[1];
    if (i === 14) return t[2];
    return v;
  });
}

function inverseTranslationMat4(t) {
  return translationMat4([-t[0], -t[1], -t[2]]);
}

function getKeysInSequence(animVector, start, end) {
  if (!animVector?.Keys?.length) return [];
  return animVector.Keys.filter((key) => key.Frame >= start && key.Frame <= end);
}

function addTrack(gltf, chunks, animation, nodeIndex, pathName, times, values, type) {
  if (times.length < 2) return;
  const timeArray = Float32Array.from(times);
  const valueArray = Float32Array.from(values.flat());
  const timeBounds = minMax(timeArray, 1);
  const timeAccessor = accessor(
    gltf,
    writeArray(gltf, chunks, timeArray),
    timeArray,
    'SCALAR',
    timeBounds.min,
    timeBounds.max
  );
  const valueAccessor = accessor(gltf, writeArray(gltf, chunks, valueArray), valueArray, type);
  const samplerIndex = animation.samplers.length;
  animation.samplers.push({
    input: timeAccessor,
    output: valueAccessor,
    interpolation: 'LINEAR',
  });
  animation.channels.push({
    sampler: samplerIndex,
    target: { node: nodeIndex, path: pathName },
  });
}

const inputBuffer = fs.readFileSync(input);
const model = parseMDX(inputBuffer.buffer.slice(inputBuffer.byteOffset, inputBuffer.byteOffset + inputBuffer.byteLength));
const chunks = [];
const gltf = {
  asset: { version: '2.0', generator: 'Codex animated mdx-to-glb via war3-model' },
  scene: 0,
  scenes: [{ nodes: [] }],
  nodes: [],
  meshes: [],
  materials: [],
  skins: [],
  animations: [],
  accessors: [],
  bufferViews: [],
  buffers: [{ byteLength: 0 }],
};

const sortedBones = [...model.Bones].sort((a, b) => a.ObjectId - b.ObjectId);
const objectToBone = new Map(sortedBones.map((bone, index) => [bone.ObjectId, index]));
const objectToNode = new Map();
const boneWorldPivots = sortedBones.map((bone) => wc3ToGltfVec3(v3(bone.PivotPoint || model.PivotPoints[bone.ObjectId])));

for (let i = 0; i < sortedBones.length; i += 1) {
  const bone = sortedBones[i];
  const parentBoneIndex = objectToBone.get(bone.Parent);
  const worldPivot = boneWorldPivots[i];
  const parentPivot = parentBoneIndex !== undefined ? boneWorldPivots[parentBoneIndex] : [0, 0, 0];
  const nodeIndex = gltf.nodes.length;
  objectToNode.set(bone.ObjectId, nodeIndex);
  gltf.nodes.push({
    name: bone.Name || `Bone_${bone.ObjectId}`,
    translation: [
      worldPivot[0] - parentPivot[0],
      worldPivot[1] - parentPivot[1],
      worldPivot[2] - parentPivot[2],
    ],
  });
}

for (let i = 0; i < sortedBones.length; i += 1) {
  const bone = sortedBones[i];
  const nodeIndex = objectToNode.get(bone.ObjectId);
  const parentNode = objectToNode.get(bone.Parent);
  if (parentNode !== undefined) {
    gltf.nodes[parentNode].children = gltf.nodes[parentNode].children || [];
    gltf.nodes[parentNode].children.push(nodeIndex);
  } else {
    gltf.scenes[0].nodes.push(nodeIndex);
  }
}

const inverseBindMatrices = new Float32Array(sortedBones.length * 16);
for (let i = 0; i < sortedBones.length; i += 1) {
  inverseBindMatrices.set(inverseTranslationMat4(boneWorldPivots[i]), i * 16);
}
const ibmAccessor = accessor(gltf, writeArray(gltf, chunks, inverseBindMatrices), inverseBindMatrices, 'MAT4');
gltf.skins.push({
  name: `${model.Info?.Name || 'War3Model'}_Skin`,
  joints: sortedBones.map((bone) => objectToNode.get(bone.ObjectId)),
  inverseBindMatrices: ibmAccessor,
});

const materialMap = new Map();
for (let i = 0; i < model.Geosets.length; i += 1) {
  const geoset = model.Geosets[i];
  const materialId = geoset.MaterialID ?? 0;

  if (!materialMap.has(materialId)) {
    const matIndex = gltf.materials.length;
    materialMap.set(materialId, matIndex);
    gltf.materials.push({
      name: materialName(model, materialId),
      pbrMetallicRoughness: {
        baseColorFactor: materialColor(matIndex),
        metallicFactor: 0,
        roughnessFactor: 0.85,
      },
      doubleSided: true,
    });
  }

  const positions = wc3ToGltfVec3Array(geoset.Vertices);
  const normals = wc3ToGltfVec3Array(geoset.Normals);
  const texcoords = geoset.TVertices?.[0] ? flipUv(geoset.TVertices[0]) : null;
  const vertexCount = geoset.Vertices.length / 3;
  const joints = new Uint8Array(vertexCount * 4);
  const weights = new Float32Array(vertexCount * 4);

  for (let vertex = 0; vertex < vertexCount; vertex += 1) {
    const skinOffset = vertex * 8;
    let sum = 0;
    for (let influence = 0; influence < 4; influence += 1) {
      const objectId = geoset.SkinWeights?.[skinOffset + influence] ?? 0;
      const boneIndex = objectToBone.get(objectId) ?? 0;
      const weight = (geoset.SkinWeights?.[skinOffset + 4 + influence] ?? (influence === 0 ? 255 : 0)) / 255;
      joints[vertex * 4 + influence] = boneIndex;
      weights[vertex * 4 + influence] = weight;
      sum += weight;
    }
    if (sum > 0) {
      for (let influence = 0; influence < 4; influence += 1) {
        weights[vertex * 4 + influence] /= sum;
      }
    }
  }

  const indices = vertexCount > 65535 ? Uint32Array.from(geoset.Faces) : Uint16Array.from(geoset.Faces);
  const posBounds = minMax(positions, 3);
  const attributes = {
    POSITION: accessor(gltf, writeArray(gltf, chunks, positions, 34962), positions, 'VEC3', posBounds.min, posBounds.max),
    NORMAL: accessor(gltf, writeArray(gltf, chunks, normals, 34962), normals, 'VEC3'),
    JOINTS_0: accessor(gltf, writeArray(gltf, chunks, joints, 34962), joints, 'VEC4'),
    WEIGHTS_0: accessor(gltf, writeArray(gltf, chunks, weights, 34962), weights, 'VEC4'),
  };

  if (texcoords) {
    attributes.TEXCOORD_0 = accessor(gltf, writeArray(gltf, chunks, texcoords, 34962), texcoords, 'VEC2');
  }

  const indexAccessor = accessor(gltf, writeArray(gltf, chunks, indices, 34963), indices, 'SCALAR');
  const meshIndex = gltf.meshes.length;
  const name = geoset.Name || `Geoset_${i}`;
  gltf.meshes.push({
    name,
    primitives: [{
      attributes,
      indices: indexAccessor,
      material: materialMap.get(materialId),
      mode: 4,
    }],
  });
  const nodeIndex = gltf.nodes.length;
  gltf.nodes.push({ name, mesh: meshIndex, skin: 0 });
  gltf.scenes[0].nodes.push(nodeIndex);
}

for (const sequence of model.Sequences) {
  const start = sequence.Interval[0];
  const end = sequence.Interval[1];
  const animation = { name: sequence.Name, samplers: [], channels: [] };

  for (let i = 0; i < sortedBones.length; i += 1) {
    const bone = sortedBones[i];
    const nodeIndex = objectToNode.get(bone.ObjectId);
    const localBase = gltf.nodes[nodeIndex].translation || [0, 0, 0];

    const translationKeys = getKeysInSequence(bone.Translation, start, end);
    addTrack(
      gltf,
      chunks,
      animation,
      nodeIndex,
      'translation',
      translationKeys.map((key) => (key.Frame - start) / 1000),
      translationKeys.map((key) => {
        const offset = wc3ToGltfVec3(key.Vector);
        return [localBase[0] + offset[0], localBase[1] + offset[1], localBase[2] + offset[2]];
      }),
      'VEC3'
    );

    const rotationKeys = getKeysInSequence(bone.Rotation, start, end);
    addTrack(
      gltf,
      chunks,
      animation,
      nodeIndex,
      'rotation',
      rotationKeys.map((key) => (key.Frame - start) / 1000),
      rotationKeys.map((key) => wc3ToGltfQuat(key.Vector)),
      'VEC4'
    );

    const scalingKeys = getKeysInSequence(bone.Scaling, start, end);
    addTrack(
      gltf,
      chunks,
      animation,
      nodeIndex,
      'scale',
      scalingKeys.map((key) => (key.Frame - start) / 1000),
      scalingKeys.map((key) => Array.from(key.Vector)),
      'VEC3'
    );
  }

  if (animation.channels.length) {
    gltf.animations.push(animation);
  }
}

const binary = Buffer.concat(chunks);
gltf.buffers[0].byteLength = binary.length;
fs.writeFileSync(output, makeGlb(gltf, binary));
console.log(JSON.stringify({
  output: path.resolve(output),
  bytes: fs.statSync(output).size,
  model: model.Info?.Name,
  geosets: model.Geosets.length,
  bones: sortedBones.length,
  animations: gltf.animations.length,
}, null, 2));
