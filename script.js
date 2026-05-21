document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('nav-menu');
    const overlay = document.getElementById('overlay');

    function toggleMenu() {
        btn.classList.toggle('open');
        menu.classList.toggle('active');
        overlay.classList.toggle('active');
        
        if(menu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    if(btn) {
        btn.addEventListener('click', toggleMenu);
    }

    if(overlay) {
        overlay.addEventListener('click', toggleMenu);
    }

    document.querySelectorAll('.contact-button').forEach(link => {
        link.addEventListener('click', () => {
            if(menu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
});
