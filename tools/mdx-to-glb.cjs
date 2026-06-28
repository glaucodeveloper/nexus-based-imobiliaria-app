const fs = require('fs');
const path = require('path');
const { parseMDX } = require('war3-model');

const input = process.argv[2];
const output = process.argv[3] || input?.replace(/\.mdx$/i, '.glb');

if (!input || !output) {
  console.error('Usage: node tools/mdx-to-glb.cjs input.mdx output.glb');
  process.exit(1);
}

function align4(buffer) {
  const pad = (4 - (buffer.length % 4)) % 4;
  return pad ? Buffer.concat([buffer, Buffer.alloc(pad)]) : buffer;
}

function componentType(typedArray) {
  if (typedArray instanceof Float32Array) return 5126;
  if (typedArray instanceof Uint32Array) return 5125;
  if (typedArray instanceof Uint16Array) return 5123;
  if (typedArray instanceof Uint8Array) return 5121;
  throw new Error(`Unsupported typed array: ${typedArray.constructor.name}`);
}

function writeArray(gltf, chunks, typedArray, target) {
  const source = Buffer.from(
    typedArray.buffer,
    typedArray.byteOffset,
    typedArray.byteLength
  );
  const offset = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const padded = align4(source);

  chunks.push(padded);

  const bufferView = gltf.bufferViews.length;
  gltf.bufferViews.push({
    buffer: 0,
    byteOffset: offset,
    byteLength: source.length,
    target,
  });

  return bufferView;
}

function accessor(gltf, bufferView, typedArray, type, min, max) {
  const index = gltf.accessors.length;
  const components = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[type];
  const entry = {
    bufferView,
    byteOffset: 0,
    componentType: componentType(typedArray),
    count: typedArray.length / components,
    type,
  };

  if (min && max) {
    entry.min = min;
    entry.max = max;
  }

  gltf.accessors.push(entry);
  return index;
}

function minMaxVec3(values) {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];

  for (let i = 0; i < values.length; i += 3) {
    for (let axis = 0; axis < 3; axis += 1) {
      const value = values[i + axis];
      if (value < min[axis]) min[axis] = value;
      if (value > max[axis]) max[axis] = value;
    }
  }

  return { min, max };
}

function war3ToGltfVec3(source) {
  const out = new Float32Array(source.length);

  for (let i = 0; i < source.length; i += 3) {
    const x = source[i];
    const y = source[i + 1];
    const z = source[i + 2];
    out[i] = x;
    out[i + 1] = z;
    out[i + 2] = -y;
  }

  return out;
}

function flipUv(source) {
  const out = new Float32Array(source.length);

  for (let i = 0; i < source.length; i += 2) {
    out[i] = source[i];
    out[i + 1] = 1 - source[i + 1];
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
  const json = align4(Buffer.from(JSON.stringify(gltf), 'utf8'));
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

const inputBuffer = fs.readFileSync(input);
const arrayBuffer = inputBuffer.buffer.slice(
  inputBuffer.byteOffset,
  inputBuffer.byteOffset + inputBuffer.byteLength
);
const model = parseMDX(arrayBuffer);
const chunks = [];
const gltf = {
  asset: {
    version: '2.0',
    generator: 'Codex mdx-to-glb via war3-model',
  },
  scene: 0,
  scenes: [{ nodes: [] }],
  nodes: [],
  meshes: [],
  materials: [],
  accessors: [],
  bufferViews: [],
  buffers: [{ byteLength: 0 }],
};

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

  const positions = war3ToGltfVec3(geoset.Vertices);
  const normals = war3ToGltfVec3(geoset.Normals);
  const texcoords = geoset.TVertices?.[0] ? flipUv(geoset.TVertices[0]) : null;
  const indices =
    geoset.Vertices.length / 3 > 65535
      ? Uint32Array.from(geoset.Faces)
      : Uint16Array.from(geoset.Faces);

  const posView = writeArray(gltf, chunks, positions, 34962);
  const normView = writeArray(gltf, chunks, normals, 34962);
  const idxView = writeArray(gltf, chunks, indices, 34963);
  const bounds = minMaxVec3(positions);
  const attributes = {
    POSITION: accessor(gltf, posView, positions, 'VEC3', bounds.min, bounds.max),
    NORMAL: accessor(gltf, normView, normals, 'VEC3'),
  };

  if (texcoords) {
    const uvView = writeArray(gltf, chunks, texcoords, 34962);
    attributes.TEXCOORD_0 = accessor(gltf, uvView, texcoords, 'VEC2');
  }

  const indexAccessor = accessor(gltf, idxView, indices, 'SCALAR');
  const meshIndex = gltf.meshes.length;
  const name = geoset.Name || `Geoset_${i}`;

  gltf.meshes.push({
    name,
    primitives: [
      {
        attributes,
        indices: indexAccessor,
        material: materialMap.get(materialId),
        mode: 4,
      },
    ],
  });

  const nodeIndex = gltf.nodes.length;
  gltf.nodes.push({ name, mesh: meshIndex });
  gltf.scenes[0].nodes.push(nodeIndex);
}

const binary = Buffer.concat(chunks);
gltf.buffers[0].byteLength = binary.length;

fs.writeFileSync(output, makeGlb(gltf, binary));
console.log(
  JSON.stringify(
    {
      output: path.resolve(output),
      bytes: fs.statSync(output).size,
      model: model.Info?.Name,
      geosets: model.Geosets.length,
      materials: gltf.materials.length,
    },
    null,
    2
  )
);
