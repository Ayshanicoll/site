// 1. Inicializa o cliente do Supabase
const supabase = supabase.createClient(
    'https://ydvnkdfgqmxfnmylffka.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlkdm5rZGZncW14Zm5teWxmZmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjEwMDYsImV4cCI6MjA5NDg5NzAwNn0.BeGtXfdZ990uSaAjel_01yg2HtX8boshUh50SDN64pw'
);

// 2. Função de voto (fora de qualquer bloco)
async function registrarVoto(perguntaId, escolha) {
    const divPergunta = document.getElementById('pergunta' + perguntaId);
    if (!divPergunta) return;

    const botoes = divPergunta.querySelectorAll('button');
    botoes.forEach(btn => btn.disabled = true);

    const { error } = await supabase
        .from('votos')
        .insert([{ pergunta_id: perguntaId, resposta: escolha }]);

    if (error) {
        console.error("Erro:", error);
        alert("Erro ao votar. Tente novamente.");
        botoes.forEach(btn => btn.disabled = false);
    } else {
        divPergunta.innerHTML = '<p>Obrigado pelo seu voto!</p>';
    }
}

// 3. Gerenciamento do Menu (apenas um bloco DOMContentLoaded)
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('nav-menu');
    const overlay = document.getElementById('overlay');

    function toggleMenu() {
        btn.classList.toggle('open');
        menu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto';
    }

    if (btn) btn.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    document.querySelectorAll('.contact-button').forEach(link => {
        link.addEventListener('click', () => {
            if (menu.classList.contains('active')) toggleMenu();
        });
    });
});
