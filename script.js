// Substitua os valores abaixo EXATAMENTE pelo que está no painel do Supabase
const SUPABASE_URL = 'https://ydvnkdfgqmxfnmylffka.supabase.co';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANON_PUBLIC_AQUI'; 

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
