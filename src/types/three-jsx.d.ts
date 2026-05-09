/* eslint-disable @typescript-eslint/no-namespace */
import type { Object3DNode, MaterialNode, BufferGeometryNode } from "@react-three/fiber";
import type {
  Mesh,
  Points,
  Group,
  PointsMaterial,
  MeshStandardMaterial,
  TorusGeometry,
  IcosahedronGeometry,
  OctahedronGeometry,
  BufferGeometry,
  BufferAttribute,
  Fog,
  AmbientLight,
  PointLight,
} from "three";

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      mesh: Object3DNode<Mesh, typeof Mesh>;
      points: Object3DNode<Points, typeof Points>;
      group: Object3DNode<Group, typeof Group>;
      pointsMaterial: MaterialNode<PointsMaterial, typeof PointsMaterial>;
      meshStandardMaterial: MaterialNode<MeshStandardMaterial, typeof MeshStandardMaterial>;
      torusGeometry: BufferGeometryNode<TorusGeometry, typeof TorusGeometry>;
      icosahedronGeometry: BufferGeometryNode<IcosahedronGeometry, typeof IcosahedronGeometry>;
      octahedronGeometry: BufferGeometryNode<OctahedronGeometry, typeof OctahedronGeometry>;
      bufferGeometry: BufferGeometryNode<BufferGeometry, typeof BufferGeometry>;
      bufferAttribute: BufferGeometryNode<BufferAttribute, typeof BufferAttribute>;
      fog: Object3DNode<Fog, typeof Fog>;
      ambientLight: Object3DNode<AmbientLight, typeof AmbientLight>;
      pointLight: Object3DNode<PointLight, typeof PointLight>;
    }
  }
}
