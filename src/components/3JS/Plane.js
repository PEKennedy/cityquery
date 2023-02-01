import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

const Plane = (props) => {
  const ref = useRef()

  // Subscribe this component to the render-loop, rotate the mesh every frame
 // useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      rotation={[-Math.PI/2,0,0]}>
        <planeGeometry args={[100, 100, 10]} />
        <meshStandardMaterial color={'green'} />
    </mesh>
  );
};

export default Plane;

//<CustomMesh position={[1.7,0,0]} />
//In another file I have a cityJSON test I'm working on

//<CustomMesh position={[5,0,0]}/>
