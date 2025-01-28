import React, { useState, useEffect, useRef, use } from 'react';
import BIRDS from 'vanta/dist/vanta.birds.min'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// import Box from '@mui/material/Box';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import InputBox from './components/URLInput';
import LoadingAnimation from './components/LoadingAnimation';
import theme from './Theme';
import VideoBackground from './components/VideoBackground';
import ScriptBox from "./components/ScriptBox";

// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { createRoot } from 'react-dom/client'
import { useFrame } from '@react-three/fiber'

import * as THREE from 'three';

			import Stats from 'three/addons/libs/stats.module.js';
			import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

			import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';

// function Box(props) {
  
//   return (
//     <mesh
//       {...props}
//       ref={meshRef}
//       scale={active ? 1.5 : 1}
//       onClick={(event) => setActive(!active)}
//       onPointerOver={(event) => setHover(true)}
//       onPointerOut={(event) => setHover(false)}>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
//     </mesh>
//   )
// }


// const MotionBox = motion(Box);

function Box(props) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (meshRef.current.rotation.x += delta))
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}



function App() {
  const [showScript, setShowScript] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptText, setScriptText] = useState("");
  
  /* TEXTURE WIDTH FOR SIMULATION */
  const WIDTH = 32;

  const BIRDS = WIDTH * WIDTH;

  // Custom Geometry - using 3 triangles each. No UVs, no normals currently.
  class BirdGeometry extends THREE.BufferGeometry {

    constructor() {

      super();

      const trianglesPerBird = 40;    //HERE
      const triangles = BIRDS * trianglesPerBird;
      const points = triangles * 3;

      const vertices = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 );
      const birdColors = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 );
      const references = new THREE.BufferAttribute( new Float32Array( points * 2 ), 2 );
      const birdVertex = new THREE.BufferAttribute( new Float32Array( points ), 1 );

      this.setAttribute( 'position', vertices );
      this.setAttribute( 'birdColor', birdColors );
      this.setAttribute( 'reference', references );
      this.setAttribute( 'birdVertex', birdVertex );

      // this.setAttribute( 'normal', new Float32Array( points * 3 ), 3 );


      let v = 0;

      function verts_push() {

        for ( let i = 0; i < arguments.length; i ++ ) {

          vertices.array[ v ++ ] = arguments[ i ];

        }

      }

      const wingsSpan = 20;

      for ( let f = 0; f < BIRDS; f ++ ) {

        // Body

        // verts_push(
        //   0, - 0, - 20,
        //   0, 4, - 20,
        //   0, 0, 30
        // );

        // Wings

        // verts_push(   // HERE
        //   0, 0, - 15,
        //   10, 0, - 15,
          
        //   5, 0, 0,
          
        //   10, 0, 15,

        //   0, 0, 15
        // );

        // verts_push(
        //   0, 0, - 15,
        // )


        // verts_push(
        //   0, 0, -15,
        //   -wingsSpan, 0, 0,
        //   0, 0,  15
        // );

        // verts_push(
        //   0, 0, 15,
        //   wingsSpan, 0, 0,
        //   0, 0, - 15
        // );

        
        verts_push(
          20.017323494, -6.999999881, 0.000000000, 15.176287889, -9.004948735, -0.021038353, 15.168085098, -15.161638260, -0.021038353);
verts_push(
          -0.000001057, 13.000000715, -0.053556580, 0.000000000, 6.000000238, 0.000000000, 8.980835676, 15.176321268, -0.021038353);
verts_push(
          6.999999881, 20.017323494, 0.000000000, -0.000001057, 13.000000715, -0.053556580, 8.980835676, 15.176321268, -0.021038353);
verts_push(
          13.000000715, 0.000001057, 0.000000000, 20.000000000, 6.999999881, 0.000000000, 15.161640644, 9.004114270, -0.021038353);
verts_push(
          20.000000000, 6.999999881, 0.000000000, 19.999998808, 20.000002384, 0.000000000, 15.161640644, 15.168086290, -0.021038353);
verts_push(
          15.161640644, 9.004114270, -0.021038353, 20.000000000, 6.999999881, 0.000000000, 15.161640644, 15.168086290, -0.021038353);
verts_push(
          20.000002384, -19.999996424, 0.000000000, 20.017323494, -6.999999881, 0.000000000, 15.168085098, -15.161638260, -0.021038353);
verts_push(
          20.017323494, -6.999999881, 0.000000000, 13.000000715, 0.000001057, 0.000000000, 15.176287889, -9.004948735, -0.021038353);
verts_push(
          -0.000000167, -13.000000715, -0.053556580, 6.999999881, -19.999998808, 0.000000000, 9.010356069, -15.161639452, -0.021038353);
verts_push(
          6.999999881, -19.999998808, 0.000000000, 20.000002384, -19.999996424, 0.000000000, 15.168085098, -15.161638260, -0.021038353);
verts_push(
          9.010356069, -15.161639452, -0.021038353, 6.999999881, -19.999998808, 0.000000000, 15.168085098, -15.161638260, -0.021038353);
verts_push(
          -20.000000000, -20.000000000, 0.000000000, -6.999999881, -20.017323494, 0.000000000, -15.088443756, -15.094984770, -0.021656454);
verts_push(
          -6.999999881, -20.017323494, 0.000000000, -0.000000167, -13.000000715, -0.053556580, -9.011171460, -15.103082657, -0.021656454);
verts_push(
          -13.000000715, 0.000000167, 0.000000000, -20.000000000, -6.999999881, 0.000000000, -15.088443756, -9.034432769, -0.021656454);
verts_push(
          -20.000000000, -6.999999881, 0.000000000, -20.000000000, -20.000000000, 0.000000000, -15.088443756, -15.094984770, -0.021656454);
verts_push(
          -15.088443756, -9.034432769, -0.021656454, -20.000000000, -6.999999881, 0.000000000, -15.088443756, -15.094984770, -0.021656454);
verts_push(
          -20.000000000, 20.000000000, 0.000000000, -20.017323494, 6.999999881, 0.000000000, -15.094987154, 15.088446140, -0.021656454);
verts_push(
          -20.017323494, 6.999999881, 0.000000000, -13.000000715, 0.000000167, 0.000000000, -15.103052855, 9.035279751, -0.021656454);
verts_push(
          0.000000000, 13.000000715, 0.000000000, -6.999999881, 20.000000000, 0.000000000, -9.034432173, 15.088446140, -0.021656454);
verts_push(
          -6.999999881, 20.000000000, 0.000000000, -20.000000000, 20.000000000, 0.000000000, -15.094987154, 15.088446140, -0.021656454);
verts_push(
          -9.034432173, 15.088446140, -0.021656454, -6.999999881, 20.000000000, 0.000000000, -15.094987154, 15.088446140, -0.021656454);
verts_push(
          -9.034432173, 15.088446140, -0.021656454, 0.000000000, 6.000000238, 0.000000000, 0.000000000, 13.000000715, 0.000000000);
verts_push(
          -15.103052855, 9.035279751, -0.021656454, -15.094987154, 15.088446140, -0.021656454, -20.017323494, 6.999999881, 0.000000000);
verts_push(
          6.999999881, 20.017323494, 0.000000000, 8.980835676, 15.176321268, -0.021038353, 15.161640644, 15.168086290, -0.021038353);
verts_push(
          -6.049718857, 0.004294515, -0.021656454, -15.103052855, 9.035279751, -0.021656454, -13.000000715, 0.000000167, 0.000000000);
verts_push(
          -15.088443756, -9.034432769, -0.021656454, -6.049718857, 0.004294515, -0.021656454, -13.000000715, 0.000000167, 0.000000000);
verts_push(
          19.999998808, 20.000002384, 0.000000000, 6.999999881, 20.017323494, 0.000000000, 15.161640644, 15.168086290, -0.021038353);
verts_push(
          -9.011171460, -15.103082657, -0.021656454, -15.088443756, -15.094984770, -0.021656454, -6.999999881, -20.017323494, 0.000000000);
verts_push(
          13.000000715, 0.000001057, 0.000000000, 15.161640644, 9.004114270, -0.021038353, 6.153295636, -0.004228354, -0.021038353);
verts_push(
          -0.040787458, -6.110498309, -0.090288222, -9.011171460, -15.103082657, -0.021656454, -0.000000167, -13.000000715, -0.053556580);
verts_push(
          9.010356069, -15.161639452, -0.021038353, -0.040787458, -6.110498309, -0.090288222, -0.000000167, -13.000000715, -0.053556580);
verts_push(
          13.000000715, 0.000001057, 0.000000000, 6.153295636, -0.004228354, -0.021038353, 15.176287889, -9.004948735, -0.021038353);
     
     
        }

      for ( let v = 0; v < triangles * 3; v ++ ) {

        const triangleIndex = ~ ~ ( v / 3 );
        const birdIndex = ~ ~ ( triangleIndex / trianglesPerBird );
        const x = ( birdIndex % WIDTH ) / WIDTH;
        const y = ~ ~ ( birdIndex / WIDTH ) / WIDTH;

        const c = new THREE.Color(
          0x666666 +
          ~ ~ ( v / 9 ) / BIRDS * 0x666666
        );

        birdColors.array[ v * 3 + 0 ] = c.r;
        birdColors.array[ v * 3 + 1 ] = c.g;
        birdColors.array[ v * 3 + 2 ] = c.b;

        references.array[ v * 2 ] = x;
        references.array[ v * 2 + 1 ] = y;

        birdVertex.array[ v ] = v % 9;

      }

      this.scale( 0.2, 0.2, 0.2 );

    }

  }

  //

  let container, stats;
  let camera, scene, renderer;
  let mouseX = 0, mouseY = 0;

  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;

  const BOUNDS = 800, BOUNDS_HALF = BOUNDS / 2;

  let last = performance.now();

  let gpuCompute;
  let velocityVariable;
  let positionVariable;
  let positionUniforms;
  let velocityUniforms;
  let birdUniforms;
  
let once = false;

  useEffect(() => {
			if(once == false){
        once = true;
        init();
      } 
      console.log("once")
  }, [])


  // This reference will give us direct access to the mesh
  // const myRef = useRef()
  // // Set up state for the hovered and active state
  // const [hovered, setHover] = useState(false)
  // const [active, setActive] = useState(false)
  // // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => (myRef.current.rotation.x += delta))
  // Return view, these are regular three.js elements expressed in JSX

  // const [vantaEffect, setVantaEffect] = useState(null)
  // const myRef = useRef(null)
  // useEffect(() => {
  //   if (!vantaEffect) {
  //     setVantaEffect(BIRDS({
  //       el: myRef.current,
  //       birdModel: loadCustomBirdModel()
  //     }))
  //     loadCustomBirdModel()
  //   }
  //   return () => {
  //     if (vantaEffect) vantaEffect.destroy()
  //   }
  // }, [vantaEffect])

  

  const handleUrlSubmit = async (url) => {
    setIsLoading(true);
    
    try {
      // Replace this with actual API call
      await new Promise(resolve => setTimeout(resolve, 7000));
      
      // example text from api call
      setScriptText(`Lorem ipsum dolor sit amet. Ut laboriosam quisquam ea explicabo enim sed quia aspernatur hic corporis odio 33 quaerat sint et veritatis atque in rerum architecto. Sit provident perferendis non perspiciatis reprehenderit ea magni sint sit aliquid recusandae est asperiores harum quo quae odio. Hic laboriosam soluta et modi ratione aut mollitia nihil et voluptatum consectetur! Eum laboriosam unde ex molestiae voluptas a exercitationem autem?

        Hic sunt officiis eum praesentium odio et officiis quae et sapiente eligendi. Qui repudiandae debitis qui veritatis modi qui molestiae dolores ad porro delectus et quam beatae et corrupti praesentium id quia quod. Ex nemo temporibus est doloribus officia id possimus cumque hic mollitia adipisci aut cumque velit aut repellat magnam in incidunt iure?
        
        At eaque dolor et molestiae consectetur ut similique doloribus est rerum similique et tempora perspiciatis. Sed impedit consequatur et veniam perferendis aut exercitationem tempora. Eos veritatis veniam et accusamus alias non sunt necessitatibus non alias minima et voluptatem maxime et quaerat tempore et molestias dicta.
        
        Et explicabo blanditiis ut assumenda voluptas et natus nemo et vitae Quis! Non repellendus voluptas qui neque aperiam et neque dolor. Quo atque iusto est suscipit pariatur est similique voluptate eos alias laborum ut quae vitae.
        
        Et nihil nisi aut galisum quisquam in esse explicabo. Et dolor perferendis nam aliquid rerum aut placeat vitae vel odit natus eum dignissimos porro et numquam dignissimos id omnis fugit.
        
        `);
      setShowScript(true);
    } catch (error) {
      console.error('Error fetching script:', error);
      // handle error
    } finally {
      setIsLoading(false);
    }
  };

  
  function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
    camera.position.z = 350;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x131313 );
    scene.fog = new THREE.Fog( 0xffffff, 100, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    container.appendChild( renderer.domElement );

    initComputeRenderer();

    stats = new Stats();
    container.appendChild( stats.dom );

    container.style.touchAction = 'none';
    container.addEventListener( 'pointermove', onPointerMove );

    //

    window.addEventListener( 'resize', onWindowResize );

    const gui = new GUI();


    const effectController = {
      separation: 64.0,
      alignment: 37.0,
      cohesion: 60.0,
      freedom: 0.75
    };

    const valuesChanger = function () {

      velocityUniforms[ 'separationDistance' ].value = effectController.separation;
      velocityUniforms[ 'alignmentDistance' ].value = effectController.alignment;
      velocityUniforms[ 'cohesionDistance' ].value = effectController.cohesion;
      velocityUniforms[ 'freedomFactor' ].value = effectController.freedom;

    };

    valuesChanger();

    gui.add( effectController, 'separation', 0.0, 100.0, 1.0 ).onChange( valuesChanger );
    gui.add( effectController, 'alignment', 0.0, 100, 0.001 ).onChange( valuesChanger );
    gui.add( effectController, 'cohesion', 0.0, 100, 0.025 ).onChange( valuesChanger );
    gui.close();

    initBirds();

  }

  function initComputeRenderer() {

    gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, renderer );

    const dtPosition = gpuCompute.createTexture();
    const dtVelocity = gpuCompute.createTexture();
    fillPositionTexture( dtPosition );
    fillVelocityTexture( dtVelocity );

    velocityVariable = gpuCompute.addVariable( 'textureVelocity', document.getElementById( 'fragmentShaderVelocity' ).textContent, dtVelocity );
    positionVariable = gpuCompute.addVariable( 'texturePosition', document.getElementById( 'fragmentShaderPosition' ).textContent, dtPosition );

    gpuCompute.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] );
    gpuCompute.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] );

    positionUniforms = positionVariable.material.uniforms;
    velocityUniforms = velocityVariable.material.uniforms;

    positionUniforms[ 'time' ] = { value: 0.0 };
    positionUniforms[ 'delta' ] = { value: 0.0 };
    velocityUniforms[ 'time' ] = { value: 1.0 };
    velocityUniforms[ 'delta' ] = { value: 0.0 };
    velocityUniforms[ 'testing' ] = { value: 1.0 };
    velocityUniforms[ 'separationDistance' ] = { value: 1.0 };
    velocityUniforms[ 'alignmentDistance' ] = { value: 1.0 };
    velocityUniforms[ 'cohesionDistance' ] = { value: 1.0 };
    velocityUniforms[ 'freedomFactor' ] = { value: 1.0 };
    velocityUniforms[ 'predator' ] = { value: new THREE.Vector3() };
    velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed( 2 );

    velocityVariable.wrapS = THREE.RepeatWrapping;
    velocityVariable.wrapT = THREE.RepeatWrapping;
    positionVariable.wrapS = THREE.RepeatWrapping;
    positionVariable.wrapT = THREE.RepeatWrapping;

    const error = gpuCompute.init();

    if ( error !== null ) {

      console.error( error );

    }

  }

  function initBirds() {

    const geometry = new BirdGeometry();

    // For Vertex and Fragment
    birdUniforms = {
      'color': { value: new THREE.Color( 0x7855fa ) },
      'texturePosition': { value: null },
      'textureVelocity': { value: null },
      'time': { value: 1.0 },
      'delta': { value: 0.0 }
    };

    // THREE.ShaderMaterial
    const material = new THREE.ShaderMaterial( {
      uniforms: birdUniforms,
      vertexShader: document.getElementById( 'birdVS' ).textContent,
      fragmentShader: document.getElementById( 'birdFS' ).textContent,
      side: THREE.DoubleSide

    } );

    const birdMesh = new THREE.Mesh( geometry, material );
    birdMesh.rotation.y = Math.PI / 2;
    birdMesh.matrixAutoUpdate = false;
    birdMesh.updateMatrix();

    scene.add( birdMesh );

  }

  function fillPositionTexture( texture ) {

    const theArray = texture.image.data;

    for ( let k = 0, kl = theArray.length; k < kl; k += 4 ) {

      const x = Math.random() * BOUNDS - BOUNDS_HALF;
      const y = Math.random() * BOUNDS - BOUNDS_HALF;
      const z = Math.random() * BOUNDS - BOUNDS_HALF;

      theArray[ k + 0 ] = x;
      theArray[ k + 1 ] = y;
      theArray[ k + 2 ] = z;
      theArray[ k + 3 ] = 1;

    }

  }

  function fillVelocityTexture( texture ) {

    const theArray = texture.image.data;

    for ( let k = 0, kl = theArray.length; k < kl; k += 4 ) {

      const x = Math.random() - 0.5;
      const y = Math.random() - 0.5;
      const z = Math.random() - 0.5;

      theArray[ k + 0 ] = x * 10;
      theArray[ k + 1 ] = y * 10;
      theArray[ k + 2 ] = z * 10;
      theArray[ k + 3 ] = 1;

    }

  }

  function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  function onPointerMove( event ) {

    if ( event.isPrimary === false ) return;

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

  }

  //

  function animate() {

    render();
    stats.update();

  }

  function render() {

    const now = performance.now();
    let delta = ( now - last ) / 1000;

    if ( delta > 1 ) delta = 1; // safety cap on large deltas
    last = now;

    positionUniforms[ 'time' ].value = now;
    positionUniforms[ 'delta' ].value = delta;
    velocityUniforms[ 'time' ].value = now;
    velocityUniforms[ 'delta' ].value = delta;
    birdUniforms[ 'time' ].value = now;
    birdUniforms[ 'delta' ].value = delta;

    velocityUniforms[ 'predator' ].value.set( 0.5 * mouseX / windowHalfX, - 0.5 * mouseY / windowHalfY, 0 );

    mouseX = 10000;
    mouseY = 10000;

    gpuCompute.compute();

    birdUniforms[ 'texturePosition' ].value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture;
    birdUniforms[ 'textureVelocity' ].value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture;

    renderer.render( scene, camera );

  }


  return (
  //   <Canvas>
  //   <ambientLight intensity={Math.PI / 2} />
  //   <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
  //   <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
  //   <Box position={[-1.2, 0, 0]} />
  //   <Box position={[1.2, 0, 0]} />
  // </Canvas>
    // <div>
    //   <Canvas>
    //     <ambientLight intensity={Math.PI / 2} />
    //     <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
    //     <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
    //     <Box position={[-1.2, 0, 0]} />
    //     <Box position={[1.2, 0, 0]} />
    //   </Canvas>
    // <ThemeProvider theme={theme}>
    //   <CssBaseline />
    // </ThemeProvider>
    // </div>
    <div></div>
  );
}

// createRoot(document.getElementById('root')).render(
//   ,
// )

export default App;