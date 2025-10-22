/* ---------------------------------- */
/* JAVASCRIPT DO MAPA (mapa.js)       */
/* ---------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Iniciar o mapa
    const map = L.map('map').setView([-23.3556, -47.8569], 14);

    // 2. Adicionar o "fundo" do mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 3. Ícones Customizados
    const redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    
    // 4. Ecopontos FIXOS (Sempre visíveis, ícone AZUL)
    const ecopontosFixos = [
        { lat: -23.32422, lon: -47.86677, nome: "Ecoponto Principal 1 (Fixo)", endereco: "Coord: 23°19'27.2\"S 47°52'00.4\"W" },
        { lat: -23.36852, lon: -47.85116, nome: "Ecoponto Principal 2 (Fixo)", endereco: "Coord: 23°22'06.7\"S 47°51'04.2\"W" },
        { lat: -23.34894, lon: -47.82391, nome: "Ecoponto Principal 3 (Fixo)", endereco: "Coord: 23°20'56.2\"S 47°49'26.1\"W" },
        { lat: -23.35167, lon: -47.87639, nome: "FATEC Tatuí (Ponto Fixo)", endereco: "Rod. Mario Batista Mori, 971 - Jd. Aeroporto" }
    ];

    ecopontosFixos.forEach(ponto => {
        L.marker([ponto.lat, ponto.lon]) 
         .addTo(map)
         .bindPopup(`<b>${ponto.nome}</b><br>${ponto.endereco}<br><br><i>Este é um Ecoponto principal.</i>`);
    });

    // 5. Pontos de Coleta FILTRÁVEIS (Fictícios, ícone VERDE)
    const pontosFiltaveis = [
        { lat: -23.352, lon: -47.855, nome: "Coleta de Papel e Vidro", bairro: "Vila Dr. Laurindo", tipos: ['papel', 'vidro'] },
        { lat: -23.348, lon: -47.860, nome: "Coleta de Plástico e Metal", bairro: "Nova Tatuí", tipos: ['plastico', 'metal'] },
        { lat: -23.357, lon: -47.868, nome: "Coleta de Eletrônicos", bairro: "Jd. Wanderley", tipos: ['eletronicos'] },
        { lat: -23.350, lon: -47.851, nome: "Coleta de Orgânicos", bairro: "Centro (Supermercado)", tipos: ['organico'] },
        { lat: -23.360, lon: -47.853, nome: "Coleta Mista (Recicláveis)", bairro: "Jd. São Conrado", tipos: ['papel', 'plastico', 'vidro', 'metal'] },
        { lat: -23.355, lon: -47.850, nome: "Coleta de Pilhas", bairro: "Centro (Farmácia)", tipos: ['pilhas'] }
    ];

    const markersFiltaveis = [];
    pontosFiltaveis.forEach(ponto => {
        const marker = L.marker([ponto.lat, ponto.lon], { icon: greenIcon });
        marker.options.tipos = ponto.tipos || [];
        marker.bindPopup(`<b>Ponto de Coleta: ${ponto.nome}</b><br>${ponto.bairro}`);
        markersFiltaveis.push(marker);
    });

    // 6. Função de Filtragem (Lógica 'some' - Pelo menos UM)
    const atualizarFiltros = () => {
        const filtrosAtivos = Array.from(document.querySelectorAll('.filtro-tipo:checked')).map(cb => cb.value);
        if (filtrosAtivos.length === 0) {
            markersFiltaveis.forEach(marker => marker.removeFrom(map));
            return; 
        }
        markersFiltaveis.forEach(marker => {
            const markerTipos = marker.options.tipos; 
            const TEM_PELO_MENOS_UM_FILTRO = filtrosAtivos.some(filtro => markerTipos.includes(filtro));
            if (TEM_PELO_MENOS_UM_FILTRO) marker.addTo(map);
            else marker.removeFrom(map);
        });
    };

    // 7. Ouvinte de Eventos para os checkboxes
    const listaFiltros = document.getElementById('lista-filtros-tipo');
    if (listaFiltros) {
        listaFiltros.addEventListener('change', atualizarFiltros);
    }

    // 8. Estado Inicial
    atualizarFiltros();
    
    
    // --- Lógica do Modal de DENÚNCIA ---
    const btnAbrirModal = document.getElementById('btn-abrir-modal-denuncia');
    const overlayModal = document.getElementById('modal-denuncia-overlay');
    const btnFecharModal = document.getElementById('modal-close-btn');
    const formDenuncia = document.getElementById('form-denuncia');
    const inputFoto = document.getElementById('foto-entulho');

    const abrirModal = () => { if (overlayModal) overlayModal.classList.add('modal-active'); };
    const fecharModal = () => {
        if (overlayModal) {
            overlayModal.classList.remove('modal-active');
            formDenuncia.reset(); 
        }
    };

    if (btnAbrirModal && overlayModal && btnFecharModal) {
        btnAbrirModal.addEventListener('click', abrirModal);
        btnFecharModal.addEventListener('click', fecharModal);
        overlayModal.addEventListener('click', (e) => { if (e.target === overlayModal) fecharModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlayModal.classList.contains('modal-active')) fecharModal(); });
    }

    const validarFoto = () => {
        if (!inputFoto || inputFoto.files.length === 0) {
            alert('Por favor, anexe uma foto para enviar a denúncia.');
            inputFoto.focus(); 
            return false;
        }
        return true;
    };

    const btnUsarLocalizacao = document.getElementById('btn-usar-localizacao');
    if (btnUsarLocalizacao) {
        btnUsarLocalizacao.addEventListener('click', () => {
            if (!validarFoto()) return;
            if (!navigator.geolocation) { alert('Geolocalização não é suportada pelo seu navegador.'); return; }

            btnUsarLocalizacao.innerHTML = 'Obtendo localização...';
            btnUsarLocalizacao.disabled = true;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude: lat, longitude: lon } = position.coords;
                    const denuciaMarker = L.marker([lat, lon], { icon: redIcon }).addTo(map);
                    denuciaMarker.bindPopup("<b>Denúncia Recebida!</b><br>Obrigado por reportar.").openPopup();
                    map.setView([lat, lon], 17); 
                    alert('Denúncia enviada com sucesso usando sua localização!');
                    fecharModal(); 
                    btnUsarLocalizacao.innerHTML = '<span class="icon-location">📍</span> Usar Minha Localização';
                    btnUsarLocalizacao.disabled = false;
                },
                (error) => {
                    let msg = "Você negou o acesso à localização.";
                    if(error.code === error.POSITION_UNAVAILABLE) msg = "Informação de localização não disponível.";
                    if(error.code === error.TIMEOUT) msg = "A solicitação de localização expirou.";
                    alert(msg);
                    btnUsarLocalizacao.innerHTML = '<span class="icon-location">📍</span> Usar Minha Localização';
                    btnUsarLocalizacao.disabled = false;
                }
            );
        });
    }

    if (formDenuncia) {
        formDenuncia.addEventListener('submit', (event) => {
            event.preventDefault(); 
            if (!validarFoto()) return;
            const endereco = document.getElementById('endereco-entulho').value;
            if (!endereco) {
                 alert('Por favor, preencha o endereço para enviar a denúncia.');
                 document.getElementById('endereco-entulho').focus();
                 return;
            }
            console.log("Denúncia enviada:", { foto: inputFoto.files[0].name, endereco, obs: document.getElementById('obs-entulho').value });
            alert('Denúncia com endereço enviada com sucesso!');
            fecharModal();
        });
    }

    // --- Lógica do Modal de CADASTRO ---
    const btnAbrirModalCadastro = document.getElementById('btn-abrir-modal-cadastro');
    const overlayModalCadastro = document.getElementById('modal-cadastro-overlay');
    const btnFecharModalCadastro = document.getElementById('modal-cadastro-close-btn');
    const formCadastro = document.getElementById('form-cadastro');

    const abrirModalCadastro = () => { if (overlayModalCadastro) overlayModalCadastro.classList.add('modal-active'); };
    const fecharModalCadastro = () => {
        if (overlayModalCadastro) {
            overlayModalCadastro.classList.remove('modal-active');
            formCadastro.reset(); 
        }
    };

    if (btnAbrirModalCadastro && overlayModalCadastro && btnFecharModalCadastro) {
        btnAbrirModalCadastro.addEventListener('click', abrirModalCadastro);
        btnFecharModalCadastro.addEventListener('click', fecharModalCadastro);
        overlayModalCadastro.addEventListener('click', (e) => { if (e.target === overlayModalCadastro) fecharModalCadastro(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlayModalCadastro.classList.contains('modal-active')) fecharModalCadastro(); });
    }

    if (formCadastro) {
        formCadastro.addEventListener('submit', (event) => {
            event.preventDefault(); 
            const nome = document.getElementById('nome-ponto').value;
            const endereco = document.getElementById('endereco-ponto').value;
            const tiposSelecionados = Array.from(formCadastro.querySelectorAll('input[name="tipos-ponto"]:checked')).map(cb => cb.value);
            if (tiposSelecionados.length === 0) {
                alert('Por favor, selecione pelo menos um tipo de resíduo que o ponto aceita.');
                return;
            }
            console.log("Nova Sugestão de Ecoponto:", { nome, endereco, tipos: tiposSelecionados });
            fecharModalCadastro();
            alert("solicitação de cadastro de ecoponto realizada com sucesso");
        });
    }

}); // Fim do 'DOMContentLoaded'