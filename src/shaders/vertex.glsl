uniform float u_time;

void main() {
  float newX = sin(position.x * u_time) * sin(position.y * u_time);
  vec3 newPosition = vec3(newX, position.y, position.z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}