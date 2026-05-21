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

// 1. Inicializa o cliente do Supabase (FORA de qualquer função)
const supabase = supabase.createClient(
    'https://ydvnkdfgqmxfnmylffka.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlkdm5rZGZncW14Zm5teWxmZmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjEwMDYsImV4cCI6MjA5NDg5NzAwNn0.BeGtXfdZ990uSaAjel_01yg2HtX8boshUh50SDN64pw'
);

// 2. Função para registrar o voto (FORA de qualquer função, para ser global)
async function registrarVoto(perguntaId, escolha) {
    // Desabilita os botões daquela pergunta específica para evitar clique duplo
    const divPergunta = document.getElementById('pergunta' + perguntaId);
    const botoes = divPergunta.querySelectorAll('button');
    botoes.forEach(btn => btn.disabled = true);

    // Envia para o Supabase
    const { error } = await supabase
        .from('votos')
        .insert([{ pergunta_id: perguntaId, resposta: escolha }]);

    if (error) {
        console.error("Erro ao votar:", error);
        alert("Ops, algo deu errado. Tente novamente.");
        botoes.forEach(btn => btn.disabled = false);
    } else {
        // Altera apenas o conteúdo da pergunta respondida
        divPergunta.innerHTML = '<p>Obrigado pelo seu voto!</p>';
    }
}

// 3. Outras interações da página (Menu, etc.)
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('menu-btn');
    if (btn) {
        const menu = document.getElementById('nav-menu');
        const overlay = document.getElementById('overlay');

        btn.addEventListener('click', function() {
            btn.classList.toggle('open');
            menu.classList.toggle('active');
            overlay.classList.toggle('active');

            if (menu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
    }
});
