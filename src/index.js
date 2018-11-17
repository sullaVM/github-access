import _ from 'lodash';

console.log(process.env.ACCESS_TOKEN);

function component() {
  let element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());