// 1. Inicializa o Supabase (fora de qualquer bloco)
const supabase = supabase.createClient(
    'https://ydvnkdfgqmxfnmylffka.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlkdm5rZGZncW14Zm5teWxmZmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjEwMDYsImV4cCI6MjA5NDg5NzAwNn0.BeGtXfdZ990uSaAjel_01yg2HtX8boshUh50SDN64pw'
);

// 2. Função global (para o onclick do HTML encontrar)
async function registrarVoto(perguntaId, escolha) {
    const divPergunta = document.getElementById('pergunta' + perguntaId);
    if (!divPergunta) return;

    // Desabilita os botões para evitar cliques múltiplos
    const botoes = divPergunta.querySelectorAll('button');
    botoes.forEach(btn => btn.disabled = true);

    // Envia o voto para o Supabase
    const { error } = await supabase
        .from('votos')
        .insert([{ pergunta_id: perguntaId, resposta: escolha }]);

    if (error) {
        console.error("Erro ao enviar voto:", error);
        alert("Erro ao registrar voto. Verifique o console (F12).");
        botoes.forEach(btn => btn.disabled = false);
    } else {
        divPergunta.innerHTML = '<p>Obrigado pelo seu voto!</p>';
    }
}

// 3. Menu (DOMContentLoaded único)
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('nav-menu');
    const overlay = document.getElementById('overlay');

    if (btn) {
        btn.addEventListener('click', function() {
            btn.classList.toggle('open');
            menu.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto';
        });
    }
});
