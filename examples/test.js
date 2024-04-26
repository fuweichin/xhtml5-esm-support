function main() {
  switch(document.contentType) {
    case 'text/html':
    case 'application/xhtml+xml':
      document.body.insertAdjacentHTML('beforeend', '<p>external module loaded</p>');
      break;
    case 'text/xml':
    case 'application/xml': {
      let xmlns = 'http://www.w3.org/1999/xhtml';
      if (document.documentElement.namespaceURI === xmlns) {
        let p = Object.assign(document.createElementNS(xmlns, 'p'), {
          textContent: 'external module loaded'
        });
        document.body.insertAdjacentElement('beforeend', p);
      }else{
        return;
      }
      break;
    }
    case 'image/svg+xml': {
      let xmlns = 'http://www.w3.org/2000/svg';
      let text = document.createElementNS(xmlns, 'text');
      text.setAttribute('x', 15);
      text.setAttribute('y', 55);
      text.textContent = 'external module loaded';
      document.documentElement.append(text);
      break;
    }
  }
}
queueMicrotask(main);
