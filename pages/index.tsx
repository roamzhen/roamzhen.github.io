import type { NextPage } from 'next';
import * as THREE from 'three';
import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import {  OrbitControls } from "@react-three/drei"
import Glass from './Grass';

// Hook
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const resizeHandler = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      // Add event listener
      window.addEventListener("resize", resizeHandler);
     
      resizeHandler();
    
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", resizeHandler);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}


function Box(props: ThreeElements['mesh']) {
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((state, delta) => (mesh.current.rotation.x += 0.01))
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}


const Home: NextPage = () => {
  const windowSize = useWindowSize();
  return (
    <Canvas
      style={{width: windowSize.width, height: windowSize.height}}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
      <Glass />
      <OrbitControls minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 2.5} />
    </Canvas>
  );
};

export default Home

