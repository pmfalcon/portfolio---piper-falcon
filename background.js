const canvas = document.createElement("canvas");
canvas.id = "hero-bg";
document.body.prepend(canvas);


const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias:true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio,2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


const scene = new THREE.Scene();
const camera = new THREE.Camera();


const geometry = new THREE.PlaneGeometry(2,2);


const material = new THREE.ShaderMaterial({

uniforms:{

    time:{
        value:0
    },

    resolution:{
        value:new THREE.Vector2(
            window.innerWidth,
            window.innerHeight
        )
    }

},


vertexShader:`

varying vec2 vUv;

void main(){

vUv=uv;

gl_Position=
vec4(position,1.0);

}

`,


fragmentShader:`

precision highp float;

uniform float time;
uniform vec2 resolution;

varying vec2 vUv;


// --------------------
// noise
// --------------------

float hash(vec2 p){

return fract(
sin(dot(p,vec2(127.1,311.7)))
*43758.5
);

}


float noise(vec2 p){

vec2 i=floor(p);
vec2 f=fract(p);

f=f*f*(3.0-2.0*f);


return mix(
mix(hash(i),hash(i+vec2(1,0)),f.x),
mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),
f.y);

}


float fbm(vec2 p){

float v=0.0;
float a=.5;


for(int i=0;i<6;i++){

v+=noise(p)*a;

p*=2.0;
a*=.5;

}

return v;

}



// --------------------
// dune terrain
// --------------------

float terrain(vec2 p){

float waves=
sin(
p.x*.2
+
fbm(p*.7)*4.0
)
*.8;


float detail=
fbm(p*2.5)*.25;


return waves+detail;

}



// --------------------
// raymarch
// --------------------

float march(vec3 ro, vec3 rd){

float depth=0.0;


for(int i=0;i<120;i++){

vec3 p=
ro+rd*depth;


float h=
p.y-terrain(
p.xz
);


if(h<0.0)
return depth;


depth+=h*.45;


}

return 50.0;

}




void main(){


vec2 uv=
(gl_FragCoord.xy-resolution.xy*.5)
/ resolution.y;


// camera

vec3 ro=
vec3(
0.0,
1.1,
time*.3
);


vec3 rd=
normalize(
vec3(
uv.x,
uv.y-.25,
1.0
)
);


// rotate perspective

rd.xz*=mat2(
cos(.15),-sin(.15),
sin(.15),cos(.15)
);



float dist=
march(ro,rd);



vec3 color;


// sky gradient

color=
mix(
vec3(
0.22,
0.31,
0.71
),
vec3(
1.0,
0.05,
0.05
),
uv.y+.4
);



// terrain hit

if(dist<40.0){


vec3 p=
ro+rd*dist;


// neon dune colors

float n=
fbm(
p.xz*.7
);


vec3 duneColor=
mix(
vec3(
0.8,
0.8,
0.75
),
vec3(
1.0,
0.55,
0.1
),
n
);


duneColor=
mix(
duneColor,
vec3(
0.3,
0.0,
0.8
),
p.y*.15
);



color=
duneColor;



// glowing edges

float glow=
exp(
-dist*.035
);


color+=
vec3(
1.0,
0.8,
0.4
)
*
glow
*.15;


}



// horizon glow

color+=
vec3(
1.0,
0.1,
0.5
)
*
exp(
-abs(uv.y-.05)*10.0
);



gl_FragColor=
vec4(
color,
1.0
);


}
`
});


const plane =
new THREE.Mesh(
geometry,
material
);

scene.add(plane);



const clock =
new THREE.Clock();



function animate(){

material.uniforms.time.value =
clock.getElapsedTime();


renderer.render(
scene,
camera
);


requestAnimationFrame(
animate
);

}


animate();



window.addEventListener(
    "resize",
    ()=>{

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        material.uniforms.resolution.value.set(
            window.innerWidth,
            window.innerHeight
        );

    }

);