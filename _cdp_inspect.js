(() => {
  const hits = [...document.querySelectorAll('*')].filter(e => (e.textContent || '').includes('Sign In') && e.children.length <= 3);
  return hits.slice(0, 8).map(e => e.tagName + '.' + e.className + ' | ' + (e.outerHTML || '').slice(0, 220)).join('\n---\n');
})()