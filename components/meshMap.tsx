import * as THREE from 'three';
import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'


const vertexShader = 
/* glsl */`
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;

}
`;

const fragementShader = 
/* glsl */
`
uniform float uTime;

varying vec2 vUv;

void main( void ) {
  gl_FragColor = vec4( 0.2, 0.2, 0.6, 1.0 );
}
`;

function MeshMap(props: ThreeElements['mesh']) {
  const mesh = useRef<THREE.Mesh>(null!)

  // floor Uniform
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const uniforms = {
    time: { value: 1.0 },
  };

  const vertices = new Float32Array( [
    -1.0, -1.0,  1.0, // v0
     1.0, -1.0,  1.0, // v1
     1.0,  1.0,  1.0, // v2
    -1.0,  1.0,  1.0, // v3
  ] );

  const indicesArray = [
    0, 1, 2,
    2, 3, 0,
  ];

  const indices = new Uint32Array(indicesArray);

  return (
    <mesh
      {...props}
      ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={vertices}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            array={indices}
            count={indices.length}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={matRef}
          attach='material'
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragementShader}
        ></shaderMaterial>
    </mesh>
  )
}

export default MeshMap;