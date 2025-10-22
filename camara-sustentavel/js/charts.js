// Espera o HTML carregar completamente antes de tentar desenhar o gráfico
document.addEventListener('DOMContentLoaded', () => {

    // --- GRÁFICO 1: TENDÊNCIAS DE CONSUMO (LINHA) ---
    const ctxTendencias = document.getElementById('graficoTendencias');

    // Verifica se o elemento realmente existe na página
    if (ctxTendencias) {
        
        // Define os dados fictícios (Mock Data) para o gráfico
        const dados = {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
            datasets: [
                {
                    label: 'Energia (MWh)',
                    data: [800, 900, 750, 850, 800, 700, 750, 850, 800],
                    borderColor: '#D42E12', // Vermelho (da nossa paleta)
                    backgroundColor: 'rgba(212, 46, 18, 0.1)',
                    fill: true,
                    tension: 0.3 // Deixa a linha suave e curvada
                },
                {
                    label: 'Água (mil m³)',
                    data: [300, 280, 310, 300, 320, 290, 300, 310, 290],
                    borderColor: '#FDB913', // Dourado (da nossa paleta)
                    backgroundColor: 'rgba(253, 185, 19, 0.1)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Resíduos (ton)',
                    data: [150, 160, 155, 140, 130, 145, 135, 120, 110],
                    borderColor: '#28a745', // Verde (da nossa paleta)
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    fill: true,
                    tension: 0.3
                }
            ]
        };

        // Define as opções de configuração do gráfico
        const opcoes = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom', // Coloca a legenda embaixo
                }
            },
            scales: {
                y: {
                    beginAtZero: false // Começa o eixo Y no valor mais adequado
                }
            }
        };

        // Cria o novo gráfico!
        new Chart(ctxTendencias, {
            type: 'line', // Tipo do gráfico
            data: dados,
            options: opcoes
        });
    }

    // A lógica para o gráfico de composição foi removida.

});