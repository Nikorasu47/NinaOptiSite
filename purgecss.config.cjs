module.exports = {
  content: [
    './index.html',
    './assets/scripts.js',
  ],
  css: [
    './assets/bootstrap/bootstrap.css',
    './assets/style.css'
  ],
  safelist: [
    /^carousel/,
    /^nav/,
    /^d-/,
    /^w-/,
    /^visually-hidden/,
    /^container/,
    /^row/,
    /^col/,
    /^py-3/,
    /^right/,
    /^left/,
  ],
  keyframes: true,
}