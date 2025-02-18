import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Model({ texture }) {
  const { scene } = useGLTF("/iphone16.glb");
  const meshRef = useRef();

  // Apply the texture to the model
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
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const texture = new THREE.Texture(img);
          texture.needsUpdate = true;
          texture.wrapT = THREE.RepeatWrapping;
          texture.wrapS = THREE.RepeatWrapping; // Ensure wrapping on both axes
          texture.repeat.set(1, 1); // Set repeat to 1 for both axes
          texture.flipY = false;
          setTexture(texture);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "24px", fontWeight: "600", maxWidth: "600px" }}>
        This is a 3D model of a phone case. You can apply a texture or image of
        your choice.
      </h1>
      <h3 style={{ marginTop: "10px", color: "#bbb" }}>
        Zoom out if the model is not visible.
      </h3>

      <label
        style={{
          cursor: "pointer",
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "500",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        Upload Texture
        <input
          type="file"
          accept="image/*"
          onChange={handleTextureUpload}
          style={{ display: "none" }}
        />
      </label>

      <div
        style={{
          width: "100%",
          height: "70vh",
          marginTop: "20px",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Canvas style={{ width: "100%", height: "100%" }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Model texture={texture} />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
