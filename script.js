// Substitua os valores abaixo EXATAMENTE pelo que está no painel do Supabase
const SUPABASE_URL = ' https://ydvnkdfgqmxfnmylffka.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlkdm5rZGZncW14Zm5teWxmZmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjEwMDYsImV4cCI6MjA5NDg5NzAwNn0.BeGtXfdZ990uSaAjel_01yg2HtX8boshUh50SDN64pw'; 

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.registrarVoto = async function(perguntaId, escolha) {
    console.log("Tentando votar na pergunta:", perguntaId, "escolha:", escolha);
    
    // Desabilita botões
    const divPergunta = document.getElementById('pergunta' + perguntaId);
    const botoes = divPergunta.querySelectorAll('button');
    botoes.forEach(btn => btn.disabled = true);

    try {
        const { data, error } = await supabase
            .from('votos')
            .insert([
                { 
                    pergunta_id: perguntaId, 
                    resposta: escolha 
                }
            ]);

        if (error) {
            console.error("Detalhes do erro do Supabase:", error);
            alert("Erro no Supabase: " + error.message);
            botoes.forEach(btn => btn.disabled = false);
        } else {
            divPergunta.innerHTML = '<p>Obrigado pelo seu voto!</p>';
        }
    } catch (err) {
        console.error("Erro inesperado:", err);
        botoes.forEach(btn => btn.disabled = false);
    }
};
