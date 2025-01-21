import { Canvas, useFrame } from "@react-three/fiber";
import { Gltf, PointerLockControls, Html } from "@react-three/drei";
import { useRef, useState, useEffect } from 'react';
import MainText from './components/MainText';

export default function App() {
  return (
    <Canvas gl={{ preserveDrawingBuffer: true }}>
      <Scene />
    </Canvas>
  );
}

function Scene() {
  const bgColor = "#84a4f4";
  const [showText, setShowText] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [controlsEnabled, setControlsEnabled] = useState(false);

  const dialogs = [
    "Hi friend! I'm Zarnath, your magical guide! Want to learn about something super cool called AI?",
    "AI is like having a really smart helper! You know how your TV remote helps you change channels? AI is like that, but much smarter!",
    "Remember when you learned to tell the difference between cats and dogs? AI can learn that too! It's just like when you practice and get better at something.",
    "AI helps Alexa understand when you ask for your favorite song. It's also why your video game characters know how to play with you!",
    "Let's explore together! Use WASD keys to walk, Space to fly up, Shift to fly down, and move your mouse to look around!",
    "AI is everywhere - it helps your parents' car stay in the right lane, helps pick movies you might like on Netflix, and even helps your tablet understand what you say!",
    "Just like you're learning new things every day at school, AI is here to help us learn and make the world more fun!"
  ];

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        setShowText(false);
        setShowModel(true);
        setShowDialog(true);
        setControlsEnabled(true);
      }
      if (event.key.toLowerCase() === 'e' && showModel) {
        if (dialogIndex < dialogs.length - 1) {
          setDialogIndex(prev => prev + 1);
        } else {
          setShowDialog(false);
          setDialogIndex(0);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showModel, dialogIndex]);

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" color={bgColor} near={-4} far={10} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-5, 5, -5]} intensity={1.5} />
      <group position={[0, -2, 0]} rotation={[0, 2, 0]} scale={2}>
        <Gltf src="/environment.glb" castShadow receiveShadow />
      </group>
      <MainText show={showText} />
      {showModel && (
        <group position={[0, -0.4, 3.5]} rotation={[0, 0.1, 0]}>
          <Gltf 
            src="/models/Wizard_Guide.glb" 
            scale={0.3}
            castShadow 
            receiveShadow 
          />
          {showDialog && (
            <Html
              position={[0, 1, 0]}
              center
              distanceFactor={8}
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                padding: '20px',
                borderRadius: '10px',
                color: 'white',
                width: '250px',
                textAlign: 'center',
                userSelect: 'none',
                fontFamily: 'Arial, sans-serif',
                transition: 'opacity 0.3s'
              }}
            >
              <div>{dialogs[dialogIndex]}</div>
              <div style={{ fontSize: '0.8em', marginTop: '5px', color: '#aaa' }}>
                {dialogIndex < dialogs.length - 1 ? '(Press E to continue)' : '(Press E to close)'}
              </div>
            </Html>
          )}
        </group>
      )}
      <FPSControls enabled={controlsEnabled} />
    </>
  );
}

function FPSControls({ enabled }) {
  const moveSpeed = 0.01;
  const controls = useRef();
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  const [moveUp, setMoveUp] = useState(false);
  const [moveDown, setMoveDown] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      switch (event.code) {
        case 'KeyW':
          setMoveForward(true);
          break;
        case 'KeyS':
          setMoveBackward(true);
          break;
        case 'KeyA':
          setMoveLeft(true);
          break;
        case 'KeyD':
          setMoveRight(true);
          break;
        case 'Space':
          event.preventDefault();
          setMoveUp(true);
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          event.preventDefault();
          setMoveDown(true);
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW':
          setMoveForward(false);
          break;
        case 'KeyS':
          setMoveBackward(false);
          break;
        case 'KeyA':
          setMoveLeft(false);
          break;
        case 'KeyD':
          setMoveRight(false);
          break;
        case 'Space':
          setMoveUp(false);
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          setMoveDown(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled]);

  useFrame(() => {
    if (!enabled || !controls.current) return;

    if (moveForward) controls.current.moveForward(moveSpeed);
    if (moveBackward) controls.current.moveForward(-moveSpeed);
    if (moveLeft) controls.current.moveRight(-moveSpeed);
    if (moveRight) controls.current.moveRight(moveSpeed);
    if (moveUp) controls.current.getObject().position.y += moveSpeed;
    if (moveDown) controls.current.getObject().position.y -= moveSpeed;
  });

  return <PointerLockControls ref={controls} />;
}
