/* ============================================================
   SISTEMA DE GESTÃO DE CLIENTES - script.js
   JavaScript puro (Vanilla JS) responsável por:
   - Validação de campos no lado do cliente
   - Máscaras de CPF, telefone e CEP
   - Busca assíncrona de endereço via API ViaCEP (fetch + async/await)
   - Preenchimento automático de endereço, cidade e estado
   - Mensagens de erro/sucesso acessíveis na própria interface
   ============================================================ */

(function () {
    'use strict';

    /* ============================================================
       1. SELEÇÃO DOS ELEMENTOS DOM
       ============================================================ */
    const form = document.querySelector('.form-cadastro');

    const campoNome = document.getElementById('nome-completo');
    const campoCpf = document.getElementById('cpf');
    const campoEmail = document.getElementById('email');
    const campoTelefone = document.getElementById('telefone');
    const campoEndereco = document.getElementById('endereco');
    const campoCidade = document.getElementById('cidade');
    const campoEstado = document.getElementById('estado');
    const campoCep = document.getElementById('cep');
    const campoTipoCliente = document.getElementById('tipo-cliente');

    const btnLimpar = form ? form.querySelector('.btn-limpar') : null;
    const btnCancelar = form ? form.querySelector('.btn-cancelar') : null;

    // URL base da API pública ViaCEP
    const VIACEP_URL = 'https://viacep.com.br/ws/';

    /* ============================================================
       2. FUNÇÕES AUXILIARES DE VALIDAÇÃO
       ============================================================ */

    // Remove tudo que não for dígito
    function apenasNumeros(valor) {
        return (valor || '').replace(/\D/g, '');
    }

    // Nome: obrigatório, mínimo 3 caracteres, idealmente nome e sobrenome
    function validarNome(valor) {
        const texto = valor.trim();
        if (texto.length === 0) {
            return { valido: false, mensagem: 'Informe o nome completo.' };
        }
        if (texto.length < 3) {
            return { valido: false, mensagem: 'O nome deve ter pelo menos 3 caracteres.' };
        }
        if (!texto.includes(' ')) {
            return { valido: false, mensagem: 'Informe nome e sobrenome.' };
        }
        return { valido: true, mensagem: '' };
    }

    // CPF: valida formato, quantidade de dígitos e dígitos verificadores
    function validarCPF(valor) {
        const cpf = apenasNumeros(valor);

        if (cpf.length === 0) {
            return { valido: false, mensagem: 'Informe o CPF.' };
        }
        if (cpf.length !== 11) {
            return { valido: false, mensagem: 'O CPF deve conter 11 dígitos.' };
        }
        // Rejeita sequências repetidas (ex: 111.111.111-11), que são inválidas
        if (/^(\d)\1{10}$/.test(cpf)) {
            return { valido: false, mensagem: 'CPF inválido.' };
        }

        // Cálculo dos dígitos verificadores
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i), 10) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9), 10)) {
            return { valido: false, mensagem: 'CPF inválido.' };
        }

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i), 10) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10), 10)) {
            return { valido: false, mensagem: 'CPF inválido.' };
        }

        return { valido: true, mensagem: '' };
    }

    // Email: usa expressão regular simples
    function validarEmail(valor) {
        const texto = valor.trim();
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (texto.length === 0) {
            return { valido: false, mensagem: 'Informe o e-mail.' };
        }
        if (!regexEmail.test(texto)) {
            return { valido: false, mensagem: 'Informe um e-mail válido.' };
        }
        return { valido: true, mensagem: '' };
    }

    // Telefone: verifica preenchimento e quantidade mínima de dígitos
    function validarTelefone(valor) {
        const numeros = apenasNumeros(valor);

        if (numeros.length === 0) {
            return { valido: false, mensagem: 'Informe o telefone.' };
        }
        if (numeros.length < 10 || numeros.length > 11) {
            return { valido: false, mensagem: 'Informe um telefone válido com DDD.' };
        }
        return { valido: true, mensagem: '' };
    }

    // Tipo de cliente: verifica se uma opção válida foi selecionada
    function validarTipoCliente(valor) {
        if (!valor) {
            return { valido: false, mensagem: 'Selecione o tipo de cliente.' };
        }
        return { valido: true, mensagem: '' };
    }

    // CEP: exige exatamente 8 dígitos
    function validarCEP(valor) {
        const numeros = apenasNumeros(valor);

        // CEP não é obrigatório, então campo vazio não gera erro de validação
        if (numeros.length === 0) {
            return { valido: true, mensagem: '' };
        }
        if (numeros.length !== 8) {
            return { valido: false, mensagem: 'Informe um CEP válido com 8 dígitos.' };
        }
        return { valido: true, mensagem: '' };
    }

    /* ============================================================
       3. MÁSCARAS
       ============================================================ */

    function mascararCPF(valor) {
        let v = apenasNumeros(valor).slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return v;
    }

    function mascararTelefone(valor) {
        let v = apenasNumeros(valor).slice(0, 11);
        if (v.length > 10) {
            // Celular: (00) 00000-0000
            v = v.replace(/(\d{2})(\d)/, '($1) $2');
            v = v.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
        } else if (v.length > 5) {
            // Fixo: (00) 0000-0000
            v = v.replace(/(\d{2})(\d)/, '($1) $2');
            v = v.replace(/(\d{4})(\d{1,4})$/, '$1-$2');
        } else if (v.length > 2) {
            v = v.replace(/(\d{2})(\d)/, '($1) $2');
        }
        return v;
    }

    function mascararCEP(valor) {
        let v = apenasNumeros(valor).slice(0, 8);
        v = v.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
        return v;
    }

    /* ============================================================
       4. MENSAGENS DE ERRO/SUCESSO NA INTERFACE
       ============================================================ */

    // Cria (ou reutiliza) o elemento <span> de mensagem logo após o campo
    function obterElementoMensagem(campo) {
        const idMensagem = campo.id + '-mensagem';
        let elementoMensagem = document.getElementById(idMensagem);

        if (!elementoMensagem) {
            elementoMensagem = document.createElement('span');
            elementoMensagem.id = idMensagem;
            elementoMensagem.className = 'mensagem-erro';
            elementoMensagem.setAttribute('aria-live', 'polite');
            campo.insertAdjacentElement('afterend', elementoMensagem);
        }
        return elementoMensagem;
    }

    // Exibe erro em um campo: classe visual + mensagem + atributos ARIA
    function mostrarErro(campo, mensagem) {
        campo.classList.add('campo-invalido');
        campo.classList.remove('campo-valido');
        campo.setAttribute('aria-invalid', 'true');

        const elementoMensagem = obterElementoMensagem(campo);
        elementoMensagem.textContent = mensagem;
        elementoMensagem.classList.remove('mensagem-sucesso');
        elementoMensagem.classList.add('mensagem-erro');
        campo.setAttribute('aria-describedby', elementoMensagem.id);
    }

    // Marca o campo como válido, removendo mensagens de erro
    function mostrarSucesso(campo) {
        campo.classList.add('campo-valido');
        campo.classList.remove('campo-invalido');
        campo.setAttribute('aria-invalid', 'false');
        limparErro(campo);
    }

    // Remove classes e mensagens de erro/sucesso de um campo
    function limparErro(campo) {
        const idMensagem = campo.id + '-mensagem';
        const elementoMensagem = document.getElementById(idMensagem);
        if (elementoMensagem) {
            elementoMensagem.textContent = '';
        }
    }

    // Remove completamente qualquer estado visual (usado no reset)
    function limparEstadoCampo(campo) {
        campo.classList.remove('campo-invalido', 'campo-valido');
        campo.removeAttribute('aria-invalid');
        campo.removeAttribute('aria-describedby');
        limparErro(campo);
    }

    /* ============================================================
       5. VALIDAÇÃO DOS CAMPOS (aplica o resultado na interface)
       ============================================================ */

    function aplicarValidacao(campo, resultado) {
        if (resultado.valido) {
            mostrarSucesso(campo);
        } else {
            mostrarErro(campo, resultado.mensagem);
        }
        return resultado.valido;
    }

    function validarCampoNome() {
        return aplicarValidacao(campoNome, validarNome(campoNome.value));
    }

    function validarCampoCpf() {
        return aplicarValidacao(campoCpf, validarCPF(campoCpf.value));
    }

    function validarCampoEmail() {
        return aplicarValidacao(campoEmail, validarEmail(campoEmail.value));
    }

    function validarCampoTelefone() {
        return aplicarValidacao(campoTelefone, validarTelefone(campoTelefone.value));
    }

    function validarCampoTipoCliente() {
        return aplicarValidacao(campoTipoCliente, validarTipoCliente(campoTipoCliente.value));
    }

    function validarCampoCep() {
        return aplicarValidacao(campoCep, validarCEP(campoCep.value));
    }

    // Executa todas as validações do formulário e retorna se está tudo válido
    function validarFormulario() {
        const validacoes = [
            validarCampoNome(),
            validarCampoCpf(),
            validarCampoEmail(),
            validarCampoTelefone(),
            validarCampoTipoCliente(),
            validarCampoCep()
        ];

        return validacoes.every(Boolean);
    }

    /* ============================================================
       6. CONSULTA ASSÍNCRONA DO CEP (ViaCEP)
       ============================================================ */

    // Exibe/oculta o indicador de carregamento próximo ao campo de CEP
    function exibirIndicadorCep(mensagem) {
        const elementoMensagem = obterElementoMensagem(campoCep);
        elementoMensagem.textContent = mensagem;
        elementoMensagem.classList.remove('mensagem-erro', 'mensagem-sucesso');
        elementoMensagem.classList.add('mensagem-info');
    }

    // Preenche automaticamente endereço, cidade e estado a partir do retorno da API
    function preencherEndereco(dados) {
        if (campoEndereco && dados.logradouro) {
            campoEndereco.value = dados.logradouro;
        }
        if (campoCidade && dados.localidade) {
            campoCidade.value = dados.localidade;
        }
        if (campoEstado && dados.uf) {
            campoEstado.value = dados.uf;
        }
    }

    // Função principal de busca do CEP utilizando fetch + async/await
    async function buscarCEP(cep) {
        exibirIndicadorCep('Consultando CEP...');

        try {
            const resposta = await fetch(VIACEP_URL + cep + '/json/');

            if (!resposta.ok) {
                throw new Error('Falha na requisição');
            }

            const dados = await resposta.json();

            if (dados.erro) {
                mostrarErro(campoCep, 'CEP não encontrado.');
                return;
            }

            preencherEndereco(dados);
            mostrarSucesso(campoCep);
            const elementoMensagem = obterElementoMensagem(campoCep);
            elementoMensagem.textContent = 'Endereço preenchido automaticamente.';
            elementoMensagem.classList.add('mensagem-sucesso');
        } catch (erro) {
            mostrarErro(campoCep, 'Não foi possível consultar o CEP. Tente novamente.');
        }
    }

    /* ============================================================
       7. EVENTOS DOS CAMPOS (validação em tempo real + máscaras)
       ============================================================ */

    if (campoNome) {
        campoNome.addEventListener('blur', validarCampoNome);
    }

    if (campoCpf) {
        campoCpf.addEventListener('input', function () {
            campoCpf.value = mascararCPF(campoCpf.value);
        });
        campoCpf.addEventListener('blur', validarCampoCpf);
    }

    if (campoEmail) {
        campoEmail.addEventListener('blur', validarCampoEmail);
    }

    if (campoTelefone) {
        campoTelefone.addEventListener('input', function () {
            campoTelefone.value = mascararTelefone(campoTelefone.value);
        });
        campoTelefone.addEventListener('blur', validarCampoTelefone);
    }

    if (campoTipoCliente) {
        campoTipoCliente.addEventListener('change', validarCampoTipoCliente);
    }

    // CEP: aplica máscara e, ao atingir 8 dígitos, dispara a busca assíncrona
    if (campoCep) {
        campoCep.addEventListener('input', function () {
            campoCep.value = mascararCEP(campoCep.value);
            const numeros = apenasNumeros(campoCep.value);

            if (numeros.length === 8) {
                buscarCEP(numeros);
            } else {
                limparEstadoCampo(campoCep);
            }
        });

        campoCep.addEventListener('blur', function () {
            const numeros = apenasNumeros(campoCep.value);
            if (numeros.length > 0 && numeros.length < 8) {
                mostrarErro(campoCep, 'Informe um CEP válido com 8 dígitos.');
            }
        });
    }

    /* ============================================================
       8. EVENTO DE SUBMIT
       ============================================================ */

    if (form) {
        form.addEventListener('submit', function (evento) {
            evento.preventDefault();

            const formularioValido = validarFormulario();

            if (!formularioValido) {
                // Foca no primeiro campo inválido para facilitar a correção
                const primeiroInvalido = form.querySelector('.campo-invalido');
                if (primeiroInvalido) {
                    primeiroInvalido.focus();
                }
                exibirMensagemFormulario('Corrija os campos destacados antes de salvar.', false);
                return;
            }

            // Não há backend: apenas simula o sucesso da operação
            exibirMensagemFormulario('Cliente validado com sucesso!', true);
        });
    }

    // Mostra uma mensagem de status geral do formulário (sucesso ou erro)
    function exibirMensagemFormulario(texto, sucesso) {
        let statusForm = document.getElementById('status-formulario');

        if (!statusForm) {
            statusForm = document.createElement('div');
            statusForm.id = 'status-formulario';
            statusForm.setAttribute('aria-live', 'polite');
            statusForm.className = 'status-formulario';
            const botoes = form.querySelector('.botoes-formulario');
            botoes.insertAdjacentElement('beforebegin', statusForm);
        }

        statusForm.textContent = texto;
        statusForm.classList.toggle('status-sucesso', sucesso);
        statusForm.classList.toggle('status-erro', !sucesso);
    }

    /* ============================================================
       9. EVENTO DE RESET (botão Limpar)
       ============================================================ */

    if (btnLimpar && form) {
        btnLimpar.addEventListener('click', function () {
            // Aguarda o comportamento padrão do reset concluir antes de limpar estados
            window.setTimeout(function () {
                const camposFormulario = form.querySelectorAll('.input-campo, .select-campo, .textarea-campo');
                camposFormulario.forEach(limparEstadoCampo);

                const statusForm = document.getElementById('status-formulario');
                if (statusForm) {
                    statusForm.textContent = '';
                    statusForm.classList.remove('status-sucesso', 'status-erro');
                }
            }, 0);
        });
    }

    /* ============================================================
       10. BOTÃO CANCELAR
       ============================================================ */

    if (btnCancelar && form) {
        btnCancelar.addEventListener('click', function () {
            form.reset();
            const camposFormulario = form.querySelectorAll('.input-campo, .select-campo, .textarea-campo');
            camposFormulario.forEach(limparEstadoCampo);

            const statusForm = document.getElementById('status-formulario');
            if (statusForm) {
                statusForm.textContent = '';
                statusForm.classList.remove('status-sucesso', 'status-erro');
            }
        });
    }

    /* ============================================================
       11. ANO ATUAL NO RODAPÉ (pequeno extra, não altera estrutura)
       ============================================================ */
    const spanAno = document.getElementById('ano-atual');
    if (spanAno) {
        spanAno.textContent = new Date().getFullYear();
    }

})();
