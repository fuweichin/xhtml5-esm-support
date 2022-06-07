import foo from './foo.js';

// let foo = {name:'foo'};
function main() {
  document.body.insertAdjacentHTML('beforeend', `<p>external module: ${foo.name}</p>`);
}
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', main) : main();
