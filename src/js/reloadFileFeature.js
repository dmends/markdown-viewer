/**
 * Funcionalidade de recarregar arquivo atual
 * Adiciona um botão no header para recarregar e reprocessar o arquivo markdown aberto
 */

// Aguarda o DOM estar carregado
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona o botão de recarregar no header
    addReloadButton();

    // Configura os event listeners
    setupReloadFeature();
});

/**
 * Adiciona o botão de recarregar no header da aplicação
 */
function addReloadButton() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) {
        console.warn('Header actions não encontrado');
        return;
    }

    // Verifica se o botão já existe
    if (document.getElementById('reload-file')) {
        console.log('Botão de recarregar já existe');
        return;
    }

    // Cria o botão de recarregar
    const reloadButton = document.createElement('button');
    reloadButton.id = 'reload-file';
    reloadButton.className = 'theme-toggle';
    reloadButton.setAttribute('aria-label', 'Recarregar arquivo atual');
    reloadButton.setAttribute('title', 'Recarregar arquivo atual');
    reloadButton.style.display = 'none'; // Inicialmente oculto

    // Adiciona o ícone
    const icon = document.createElement('i');
    icon.className = 'fas fa-sync-alt';
    reloadButton.appendChild(icon);

    // Insere como primeiro botão no header-actions (da esquerda para direita)
    headerActions.insertBefore(reloadButton, headerActions.firstElementChild);

    console.log('✅ Botão de recarregar adicionado como primeiro botão no header');
}

/**
 * Configura os event listeners para a funcionalidade de recarregar
 */
function setupReloadFeature() {
    // Listener para mostrar/ocultar o botão quando um arquivo é selecionado
    document.addEventListener('fileSelected', function(event) {
        const reloadButton = document.getElementById('reload-file');
        if (reloadButton) {
            reloadButton.style.display = 'block';
            console.log('🔄 Botão de recarregar ativado para:', event.detail.file.path);
        }
    });

    // Listener para o clique no botão de recarregar
    document.addEventListener('click', function(event) {
        if (event.target.id === 'reload-file' || event.target.closest('#reload-file')) {
            event.preventDefault();
            reloadCurrentFile();
        }
    });
}

/**
 * Recarrega o arquivo atual, limpando o cache e reprocessando
 */
async function reloadCurrentFile() {
    const markdownProcessor = globalThis.markdownProcessor;

    if (!markdownProcessor) {
        console.error('MarkdownProcessor não encontrado');
        return;
    }

    if (!markdownProcessor.currentFile) {
        console.warn('Nenhum arquivo carregado para recarregar');
        return;
    }

    try {
        console.log(`🔄 Recarregando arquivo: ${markdownProcessor.currentFile.path}`);

        // Adiciona animação de rotação ao botão
        const reloadButton = document.getElementById('reload-file');
        const icon = reloadButton?.querySelector('i');
        if (icon) {
            icon.classList.add('fa-spin');
        }

        // Remove do cache para forçar recarregamento
        markdownProcessor.cache.delete(markdownProcessor.currentFile.path);

        // Recarrega o arquivo
        await markdownProcessor.loadAndProcessFile(markdownProcessor.currentFile);

        // Remove animação após um breve delay
        setTimeout(() => {
            if (icon) {
                icon.classList.remove('fa-spin');
            }
        }, 500);

        console.log('✅ Arquivo recarregado com sucesso');

        // Mostra notificação de sucesso se possível
        if (globalThis.uiManager && typeof globalThis.uiManager.showToast === 'function') {
            globalThis.uiManager.showToast('Arquivo recarregado com sucesso', 'success', 2000);
        }

    } catch (error) {
        console.error('❌ Erro ao recarregar arquivo:', error);

        // Remove animação em caso de erro
        const reloadButton = document.getElementById('reload-file');
        const icon = reloadButton?.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-spin');
        }

        // Mostra notificação de erro se possível
        if (globalThis.uiManager && typeof globalThis.uiManager.showToast === 'function') {
            globalThis.uiManager.showToast('Erro ao recarregar arquivo', 'error', 3000);
        }
    }
}

// Expõe a função reloadCurrentFile no escopo global (window)
window.reloadCurrentFile = reloadCurrentFile;
