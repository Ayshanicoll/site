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

// 1. Inicializa o cliente do Supabase
const supabase = supabase.createClient(
    'https://ydvnkdfgqmxfnmylffka.supabase.co',
    'sb_publishable_Q4AG8syUmIOYS1irK-KOgg_OX6NbH_q'
);

// 2. Função para registrar o voto
async function registrarVoto(perguntaId, escolha) {
    const { data, error } = await supabase
        .from('votos')
        .insert([{ pergunta_id: perguntaId, resposta: escolha }]);

    if (error) {
        console.error("Erro ao votar:", error);
        alert("Ops, algo deu errado. Tente novamente.");
    } else {
        alert("Voto registrado com sucesso! Obrigado pela participação.");
    }
}

