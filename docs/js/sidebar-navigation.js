// Navigation dropdown functionality
(function() {
const collapsibleItems = document.querySelectorAll('.menu__list-item-collapsible');

collapsibleItems.forEach(item => {
    const link = item.querySelector('a:first-child');
    const childList = item.querySelector('ul');

    if (link && childList) {
    // Create dropdown arrow
    const arrow = document.createElement('span');
    arrow.className = 'menu__caret';
    arrow.innerHTML = '▶';
    arrow.style.cssText = 'display: inline-block; margin-right: 0.25rem; transition: transform 0.2s; cursor: pointer;';

    // Check if this item or any child is active
    const isActive = item.classList.contains('menu__list-item-collapsible--active') ||
                    item.querySelector('.menu__link--active');

    // Set initial state
    if (isActive) {
        childList.style.display = 'block';
        arrow.style.transform = 'rotate(90deg)';
    } else {
        childList.style.display = 'none';
    }

    // Append arrow to link (after text)
    link.appendChild(arrow);

    // Make the entire link clickable for toggling
    link.style.cursor = 'pointer';
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = childList.style.display === 'block';

        if (isExpanded) {
        childList.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)';
        } else {
        childList.style.display = 'block';
        arrow.style.transform = 'rotate(90deg)';
        }
    });
    }
});
})();
