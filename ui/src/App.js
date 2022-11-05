import logo from './logo.svg';
import './App.css';
import React, { useRef, useState } from 'react';
import axios from 'axios';

import { Canvas, useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry } from 'three';

import CustomMesh from './cityJSONLoader.js'
//import CityObjects from './twobuildings.city.json';

const backendURL = 'http://localhost:5000/'

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  // Return the view, these are regular Threejs elements expressed in JSX

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>

  )
}

//<CustomMesh position={[1.7,0,0]} />
//In another file I have a cityJSON test I'm working on

class App extends React.Component {

  state = {
    details:[],
  }

  componentDidMount() {
    let data ;

    axios.get(backendURL+'wel/')
    .then(res => {
        data = res.data;
        this.setState({
            details : data    
        });
    })
    .catch(err => {})
}

  render(){
    return (
      <div>
        See <code>env/backend/backend/urls.py</code> and <code>env/backend/core/views.py</code><br/>
        For adding backend url paths.<br/><br/>

        If there is database data, and the urls are set up correctly, there should be<br/>
        Some large bold text here:

        {this.state.details.map((detail, id) =>  (
            <div key={id}>
            <div >
                  <div >
                        <h1>{detail.detail} </h1>
                        <footer >
                        <cite title="Source Title">
                        {detail.name}</cite>
                        </footer>
                  </div>
            </div>
          </div>
          )
        )}
        <br/>
        This demos <code>react-three-fiber</code>, a library for using three.js and react together:
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
          <CustomMesh position={[5,0,0]}/>
        </Canvas>

      </div>
    );
  }
}

export default App;
