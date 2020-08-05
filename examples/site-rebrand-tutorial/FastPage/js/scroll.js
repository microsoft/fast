const anchors = Array.from(document.querySelectorAll('a[name]'));
const xPositions = anchors.map(a => { return a.getBoundingClientRect().top + window.pageYOffset;} );
const navItems = Array.from(document.querySelectorAll('li.nav-item'));

document.addEventListener('scroll', e => {
    const maxScroll = window.pageYOffset + window.innerHeight + 100 > document.body.scrollHeight;

    if (maxScroll) {
        navItems.forEach(n => {n.classList.remove('active');});
        navItems[anchors.length - 1].classList.add('active');
    } else {
        for(let i = anchors.length - 1; i >= 0; --i) {
            if (window.pageYOffset + 120 > xPositions[i]) {
                navItems.forEach(n => {n.classList.remove('active');});
                navItems[i].classList.add('active');
                return;
            }
        }
    }
});
