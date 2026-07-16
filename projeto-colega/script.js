import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const host = document.querySelector('#factory-scene');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, host.clientWidth / host.clientHeight, .1, 100);
camera.position.set(6, 5, 8); camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(host.clientWidth, host.clientHeight); renderer.shadowMap.enabled = true; host.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x675d4d, 2.3));
const key = new THREE.DirectionalLight(0xffffff, 3); key.position.set(4, 7, 5); key.castShadow = true; scene.add(key);
const group = new THREE.Group(); scene.add(group);
const mat = (color, rough=.55) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: .05 });
const floor = new THREE.Mesh(new THREE.CylinderGeometry(3.7, 3.7, .18, 64), mat(0xd9d3c6)); floor.position.y = -1.25; floor.receiveShadow = true; group.add(floor);
const addBox = (x,y,z,w,h,d,color) => { const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color)); mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true; group.add(mesh); return mesh; };
addBox(-1.3,-.5,0,1.4,1.35,1.5,0x3157e1); addBox(.5,-.72,.2,1.7,.9,1.2,0xff735f); addBox(1.45,-.5,-1.1,.9,1.35,.9,0x2b8c69); addBox(-.15,-.9,-1.55,2.2,.5,.65,0xffd75e);
for(let i=0;i<4;i++){ const pipe=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,1.8,16),mat(0x24231f,.25)); pipe.position.set(-1.65+i*.35,.65,0); pipe.castShadow=true; group.add(pipe); }
const ring = new THREE.Mesh(new THREE.TorusGeometry(2.55,.025,12,100),mat(0x3157e1,.2)); ring.rotation.x=Math.PI/2; ring.position.y=.25; group.add(ring);
for(let i=0;i<18;i++){const dot=new THREE.Mesh(new THREE.SphereGeometry(.035,10,10),mat(i%3===0?0xff735f:0x3157e1));const a=i/18*Math.PI*2;dot.position.set(Math.cos(a)*2.55,.25,Math.sin(a)*2.55);group.add(dot)}

let targetX=.18,targetY=-.35,drag=false,lastX=0;
renderer.domElement.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener('pointermove',e=>{if(drag){targetY+=(e.clientX-lastX)*.008;lastX=e.clientX}});
renderer.domElement.addEventListener('pointerup',()=>drag=false);
function render(){ if(!drag&&!reduced) targetY+=.002; group.rotation.y+=(targetY-group.rotation.y)*.05;group.rotation.x+=(targetX-group.rotation.x)*.05; renderer.render(scene,camera);requestAnimationFrame(render)}render();
addEventListener('resize',()=>{camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight)});

if(!reduced){gsap.timeline({defaults:{ease:'power3.out'}}).from('.nav>*',{y:-15,opacity:0,stagger:.08}).from('.hero-copy>*',{y:30,opacity:0,stagger:.09,duration:.7},'-.2').from('.scene-wrap',{scale:.88,opacity:0,duration:1},'-.7').from('.scene-label',{scale:.7,opacity:0,stagger:.12},'-.3');document.querySelectorAll('.section').forEach(s=>gsap.from(s.children,{scrollTrigger:{trigger:s,start:'top 78%'},y:45,opacity:0,stagger:.12,duration:.75,ease:'power3.out'}));gsap.to('.flower',{rotation:360,duration:24,repeat:-1,ease:'none'});gsap.to('.rings',{rotation:-360,duration:35,repeat:-1,ease:'none'});}
gsap.to({n:0},{n:1248,duration:reduced?0:1.7,delay:.7,ease:'power2.out',onUpdate(){document.querySelector('[data-value]').textContent=Math.round(this.targets()[0].n).toLocaleString('pt-BR')}});
addEventListener('pointermove',e=>gsap.to('.cursor-glow',{x:e.clientX,y:e.clientY,duration:.6}));
document.querySelector('form').addEventListener('submit',e=>{e.preventDefault();gsap.fromTo('.toast',{y:90},{y:0,duration:.45,ease:'back.out(1.6)',onComplete:()=>gsap.to('.toast',{y:90,delay:2.3})});});
