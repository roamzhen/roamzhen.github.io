import * as THREE from 'three';
import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


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

uniform sampler2D colorTexture;

varying vec2 vUv;

void main( void ) {
  vec2 position = - 1.0 + 2.0 * vUv;

  float a = atan( position.y, position.x );
  float r = sqrt( dot( position, position ) );

  vec2 uv;
  uv.x = cos( a ) / r;
  uv.y = sin( a ) / r;
  uv /= 10.0;
  uv += uTime * 0.05;

  vec3 color = texture2D( colorTexture, uv ).rgb;

  gl_FragColor = vec4( color * r * 1.5, 1.0 );

}
`;

function Ground(props: ThreeElements['group']) {

  const group = useRef() as React.Ref<THREE.Group>;

  // Loader
  // Textures
  const colorMap = useLoader(TextureLoader, '/assets/texture/disturb.jpg')  
  colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
  // GLTF
  const gltfItem = useLoader(GLTFLoader, '/assets/gltf/cozy_day/scene.gltf')


  // floor Uniform
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const uniforms = {
    time: { value: 1.0 },
    colorTexture: { value: colorMap },
  };
  const mesh = useRef<THREE.Mesh>(null!)


  useFrame(({clock}) => {
    if(matRef.current){
      matRef.current.uniforms.uTime = {value: clock.getElapsedTime()}
    }
  })

  return (
    <>
      <primitive object={gltfItem.scene} position={[0, 0, 0]} scale={[0.4, 0.4, 0.4]}/>
      <mesh
        position={[0, -0.3, 0]}
        ref={mesh}>
          <boxGeometry args={[4, 0.5, 4]} />
          <shaderMaterial
            ref={matRef}
            attach='material'
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragementShader}
          ></shaderMaterial>
      </mesh>
    </>
  )
}

export default Ground;