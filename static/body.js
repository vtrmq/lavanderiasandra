const root = location.pathname.split('/')[1] === '' ? 'main' : location.pathname.split('/')[1];
document.querySelector("html").classList.add(root)
