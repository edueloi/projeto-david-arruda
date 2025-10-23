document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        // ... (seu código do loading screen pode continuar aqui) ...
        let domLoaded = false;
        let minimumTimeElapsed = false;
        const minimumDisplayTime = 1500;

        function hideLoadingScreen() {
            if (domLoaded && minimumTimeElapsed) {
                loadingScreen.classList.add('hidden');
                loadingScreen.addEventListener('transitionend', function() {
                    loadingScreen.remove();
                }, { once: true });
            }
        }
        domLoaded = true;
        hideLoadingScreen();
        setTimeout(function() {
            minimumTimeElapsed = true;
            hideLoadingScreen();
        }, minimumDisplayTime);
    }

    // --- LÓGICA SIMPLIFICADA E CORRIGIDA PARA O MENU HAMBURGUER ---
    const hamburgerBtn = document.getElementById('hamburger-menu');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburgerBtn && mobileMenu) {
        // O mesmo botão abre e fecha o menu
        hamburgerBtn.addEventListener('click', () => {
            // Usa 'toggle' para adicionar/remover a classe 'open'
            hamburgerBtn.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            
            // Trava o scroll do corpo da página quando o menu está aberto
            if (mobileMenu.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Fecha o menu se clicar fora do painel (no overlay escuro)
        mobileMenu.addEventListener('click', (event) => {
            if (event.target === mobileMenu) { // Verifica se o clique foi no overlay
                hamburgerBtn.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            }
        });

        // Opcional: Fecha o menu ao clicar em um link
        const navLinks = mobileMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }
});