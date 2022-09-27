import * as THREE from 'three';
import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'

function Glass(props: ThreeElements['mesh']) {
  const mesh = useRef<THREE.Mesh>(null!)
  return (
    <mesh
      {...props}
      ref={mesh}>
    </mesh>
  )
}

export default Glass;