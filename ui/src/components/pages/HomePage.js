import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import Box from '../molecules/Box';

const HomePage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    let data ;

    axios.get('http://localhost:5000/wel/')
    .then(res => {
        data = res.data;
        setData({
            details : data    
        });
    })
    .catch(err => {})
  });
  return (
    <div>
        See <code>env/backend/backend/urls.py</code> and <code>env/backend/core/views.py</code><br/>
        For adding backend url paths.<br/><br/>

        If there is database data, and the urls are set up correctly, there should be<br/>
        Some large bold text here:

        {data.map((detail, id) =>  (
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
        </Canvas>
      </div>
  );
};

export default HomePage;
