import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Model({ texture }) {
  const { scene } = useGLTF("/iphone16.glb");
  const meshRef = useRef();

  if (texture) {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.map = texture;
        child.material.needsUpdate = true;
      }
    });
  }

  return <primitive ref={meshRef} object={scene} />;
}

function App() {
  const [texture, setTexture] = useState(null);

  const handleTextureUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const texture = new THREE.Texture(img);
        texture.needsUpdate = true;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, -1);
        setTexture(texture);
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleTextureUpload} />
      <Canvas style={{ width: "100%", height: "100vh" }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Model texture={texture} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
