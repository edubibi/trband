
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-2';
canvas.id = 'liquidCanvas';

const gl = canvas.getContext('webgl');

if (!gl) { console.error('WebGL not supported'); }

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', resize);
resize();

const vsSource = `
    attribute vec4 aVertexPosition;
    void main() { gl_Position = aVertexPosition; }
`;

// "Paint in Water" Shader
const fsSource = `
    precision highp float;
    uniform float iTime;
    uniform vec2 iResolution;

    // Simplex noise function
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    // FBM for cloud-like detail
    float fbm(vec2 x) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
        for (int i = 0; i < 5; ++i) {
            v += a * snoise(x);
            x = rot * x * 2.0 + shift;
            a *= 0.5;
        }
        return v;
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        float time = iTime * 0.5; // Significantly faster for more "fluidity"

        vec2 p = uv * 2.0 - 1.0;
        p.x *= iResolution.x / iResolution.y;

        // Domain warping
        vec2 q = vec2(0.);
        q.x = fbm(p + 0.0 * time);
        q.y = fbm(p + vec2(1.0));

        vec2 r = vec2(0.);
        r.x = fbm(p + 1.0 * q + vec2(1.7, 9.2) + 0.15 * time);
        r.y = fbm(p + 1.0 * q + vec2(8.3, 2.8) + 0.126 * time);

        float f = fbm(p + r);

        // Defined "Ink" colors - Energetic Palette
        vec3 colorBg = vec3(0.95, 0.95, 0.95); // White/Light Grey background
        vec3 ink1 = vec3(1.0, 0.5, 0.0); // Orange
        vec3 ink2 = vec3(0.9, 0.1, 0.1); // Red
        vec3 ink3 = vec3(0.2, 0.8, 0.2); // Green
        vec3 ink4 = vec3(1.0, 1.0, 1.0); // Pure White highlights

        // Mixing logic
        vec3 color = mix(colorBg, ink1, clamp(f * f * 4.0, 0.0, 1.0));
        color = mix(color, ink2, clamp(length(q), 0.0, 1.0));
        color = mix(color, ink3, clamp(r.x, 0.0, 1.0));
        color = mix(color, ink4, clamp(r.y, 0.0, 0.5)); // White streaks

        // Keep it bright!
        float density = f * f * f + 0.6 * f * f + 0.5 * f;
        gl_FragColor = vec4(color * (0.8 + density * 0.5), 1.0); // Maintain brightness
    }
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);

const posLoc = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
const timeLoc = gl.getUniformLocation(shaderProgram, 'iTime');
const resLoc = gl.getUniformLocation(shaderProgram, 'iResolution');

function render(time) {
    time *= 0.001;
    resize();
    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(timeLoc, time);
    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}

requestAnimationFrame(render);
