window.addEventListener('load,', function() {
    const topbar = document.getElementById('topFixedBar');

    if (topbar === null) return;

    topbar.style.background = 'inherit';
    topbar.style.backgroundPositionX = '-55px';

    window.addEventListener('scroll', function() {
        const position = (25 - window.scrollY) % 75;
        topbar.style.backgroundPositionY = `${position}px`;
    });
});
