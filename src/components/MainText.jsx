import React, { useRef } from 'react';
import { Text3D } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function MainText({ show }) {
  const textRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(  0.5) * 0.2;
    }
    if (materialRef.current) {
      materialRef.current.color.setHSL(
        (Math.sin(time * 0.5) + 1) / 2,
        0.7,
        0.6
      );
    }
  });

  if (!show) return null;

  return (
    <group position={[-0.9, 0, 3.4]}>
      <Text3D
        ref={textRef}
        font="/fonts/Bubblegum Sans_Regular.json"
        size={0.4}
        height={0.1}
        curveSegments={32}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelSegments={5}
      >
        Prac AI
        <meshPhongMaterial
          ref={materialRef}
          color="#ff44ff"
          specular="#ffffff"
          shininess={100}
          attach="material"
        />
      </Text3D>
      <Text3D
        position={[0, -0.7, 0]}
        font="/fonts/Bubblegum Sans_Regular.json"
        size={0.15}
        height={0.05}
      >
        Press Enter to begin
        <meshPhongMaterial
          color="#ff44ff"
          specular="#ffffff"
          shininess={100}
          attach="material"
        />
      </Text3D>
    </group>
  );
}
