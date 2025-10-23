// js/contato.js

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const submitButton = document.getElementById('submitButton');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            // --- MELHORIA: Feedback visual no botão ---
            const originalButtonHTML = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = `Enviando... <i class="fas fa-spinner fa-spin"></i>`;
            // -----------------------------------------

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Simula um pequeno atraso, como se estivesse enviando para um servidor
            setTimeout(() => {
                // Obtenha os contatos existentes ou inicialize um array vazio
                let contacts = JSON.parse(localStorage.getItem('contactMessages')) || [];

                // Adicione a nova mensagem de contato
                contacts.push({
                    name: name,
                    email: email,
                    message: message,
                    timestamp: new Date().toISOString()
                });

                // Salve os contatos atualizados no localStorage
                localStorage.setItem('contactMessages', JSON.stringify(contacts));

                // Exibe a mensagem de sucesso
                successMessage.style.display = 'block';

                // Limpa o formulário
                contactForm.reset();

                // Esconde a mensagem de sucesso e restaura o botão após 4 segundos
                setTimeout(() => {
                    successMessage.style.display = 'none';
                    // Restaura o estado original do botão
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonHTML;
                }, 4000); // A mensagem fica visível por 4 segundos

                console.log('Mensagem salva no localStorage:', contacts);

            }, 1000); // Atraso de 1 segundo para simular o envio
        });
    }
});