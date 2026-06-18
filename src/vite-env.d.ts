/// <reference types="vite/client" />

// Type declarations so TypeScript accepts GLSL imports handled by vite-plugin-glsl.
declare module '*.glsl' {
  const value: string;
  export default value;
}
declare module '*.vert' {
  const value: string;
  export default value;
}
declare module '*.frag' {
  const value: string;
  export default value;
}
