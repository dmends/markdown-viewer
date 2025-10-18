/**
 * Módulo responsável pelo gerenciamento da estrutura de arquivos
 * e navegação no sistema de arquivos
 */

class FileManager {
    constructor() {
        this.currentPath = '';
        this.fileStructure = {};
        this.filteredFiles = {};
        this.searchTerm = '';
        
        // Cache para otimização
        this.cache = new Map();
        
        // Carregador dinâmico de arquivos
        this.dynamicLoader = null;
        this.useDynamicLoader = false;
        
        // Eventos customizados
        this.events = {
            fileSelected: 'fileSelected',
            structureLoaded: 'structureLoaded',
            searchUpdated: 'searchUpdated'
        };
        
        this.init();
    }
    
    /**
     * Inicializa o gerenciador de arquivos
     */
    init() {
        console.log('🗂️ FileManager: Inicializando...');
        
        // Inicializa o carregador dinâmico se disponível
        if (typeof DynamicFileLoader !== 'undefined') {
            this.dynamicLoader = new DynamicFileLoader();
            console.log('✅ FileManager: DynamicFileLoader disponível');
        } else {
            console.log('⚠️ FileManager: DynamicFileLoader não disponível, usando modo estático');
        }
        
        this.loadFileStructure();
        this.setupEventListeners();
    }
    
    /**
     * Carrega a estrutura de arquivos
     * Tenta usar carregamento dinâmico ou fallback para structure.json
     */
    async loadFileStructure() {
        try {
            console.log('📂 FileManager: Carregando estrutura de arquivos...');
            
            // Remove mensagem de loading padrão
            const loadingMessage = document.querySelector('.loading-message');
            if (loadingMessage) {
                loadingMessage.remove();
            }
            
            // SEMPRE mostra opções se o navegador suporta File System Access API
            // Mesmo se existir structure.json, dá a opção ao usuário
            if (this.dynamicLoader && this.dynamicLoader.isSupported()) {
                console.log('✅ FileManager: Navegador suporta File System Access API');
                
                // Verifica se structure.json existe
                const hasStructureJson = await this.checkStructureJsonExists();
                
                // Mostra opções com informação se existe JSON
                this.showLoadingOptions(hasStructureJson);
            } else {
                console.log('⚠️ FileManager: Navegador não suporta File System Access API, usando structure.json');
                // Fallback para structure.json
                await this.loadStaticStructure();
            }
            
        } catch (error) {
            console.error('❌ FileManager: Erro ao carregar estrutura de arquivos:', error);
            this.showError('Erro ao carregar a estrutura de arquivos');
        }
    }
    
    /**
     * Verifica se structure.json existe
     */
    async checkStructureJsonExists() {
        try {
            const response = await fetch('./documentos/structure.json', { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Mostra opções de carregamento (dinâmico ou estático)
     */
    showLoadingOptions(hasStructureJson = false) {
        const fileTreeContainer = document.getElementById('file-tree');
        if (!fileTreeContainer) return;
        
        // Dispara evento indicando que interface está pronta para escolha
        this.dispatchEvent('loadingOptionsShown', { 
            supportsDynamic: true,
            hasStructureJson: hasStructureJson
        });
        
        const jsonInfo = hasStructureJson 
            ? '<small style="color: var(--success-color); display: block; margin-top: 0.5rem;"><i class="fas fa-check-circle"></i> structure.json detectado</small>'
            : '<small style="color: var(--text-muted); display: block; margin-top: 0.5rem;"><i class="fas fa-info-circle"></i> Nenhum structure.json encontrado</small>';
        
        fileTreeContainer.innerHTML = `
            <div style="padding: 2rem 1rem; text-align: center;">
                <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem; display: block;"></i>
                <h3 style="color: var(--text-primary); margin-bottom: 1rem;">Escolha como carregar os arquivos</h3>
                ${jsonInfo}
                
                <button id="load-dynamic" style="
                    width: 100%;
                    margin: 1.5rem 0 0.75rem 0;
                    padding: 1rem;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: var(--border-radius);
                    cursor: pointer;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                    <i class="fas fa-folder"></i>
                    <span>Selecionar Pasta Local</span>
                </button>
                
                <button id="load-static" style="
                    width: 100%;
                    padding: 1rem;
                    background: var(--surface-color);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius);
                    cursor: pointer;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                " onmouseover="this.style.background='var(--hover-color)'" onmouseout="this.style.background='var(--surface-color)'">
                    <i class="fas fa-file-code"></i>
                    <span>Usar structure.json</span>
                </button>
                
                <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 1rem;">
                    <strong>Pasta Local:</strong> Carrega arquivos diretamente do seu computador<br>
                    <strong>structure.json:</strong> Usa estrutura pré-configurada
                </p>
            </div>
        `;
        
        // Adiciona event listeners
        document.getElementById('load-dynamic')?.addEventListener('click', () => {
            this.loadDynamicStructure();
        });
        
        document.getElementById('load-static')?.addEventListener('click', () => {
            this.loadStaticStructure();
        });
    }
    
    /**
     * Carrega estrutura de forma dinâmica
     */
    async loadDynamicStructure() {
        try {
            const fileTreeContainer = document.getElementById('file-tree');
            if (fileTreeContainer) {
                fileTreeContainer.innerHTML = `
                    <div style="padding: 2rem 1rem; text-align: center;">
                        <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 1rem; display: block;"></i>
                        <p style="color: var(--text-secondary);">Aguardando seleção da pasta...</p>
                    </div>
                `;
            }
            
            const success = await this.dynamicLoader.initialize();
            
            if (success) {
                this.useDynamicLoader = true;
                this.fileStructure = this.dynamicLoader.getFileStructure();
                this.filteredFiles = { ...this.fileStructure };
                this.renderFileTree();
                this.dispatchEvent(this.events.structureLoaded, { 
                    structure: this.fileStructure,
                    dynamic: true 
                });
                
                console.log('✅ Estrutura carregada dinamicamente');
            } else {
                // Usuário cancelou, mostra opções novamente
                this.showLoadingOptions();
            }
            
        } catch (error) {
            console.error('Erro ao carregar estrutura dinâmica:', error);
            
            // Mostra erro e fallback
            if (confirm(`Erro ao carregar pasta: ${error.message}\n\nDeseja usar structure.json como fallback?`)) {
                await this.loadStaticStructure();
            } else {
                this.showLoadingOptions();
            }
        }
    }
    
    /**
     * Carrega estrutura de forma estática (structure.json)
     */
    async loadStaticStructure() {
        try {
            const structure = await this.loadConfigFile();
            
            if (structure) {
                this.useDynamicLoader = false;
                this.fileStructure = structure;
            } else {
                // Se não existir configuração, usa uma estrutura padrão
                this.fileStructure = this.getDefaultStructure();
            }
            
            this.filteredFiles = { ...this.fileStructure };
            this.renderFileTree();
            this.dispatchEvent(this.events.structureLoaded, { 
                structure: this.fileStructure,
                dynamic: false 
            });
            
            console.log('✅ Estrutura carregada de structure.json');
            
        } catch (error) {
            console.error('Erro ao carregar structure.json:', error);
            throw error;
        }
    }
    
    /**
     * Tenta carregar um arquivo de configuração da estrutura
     */
    async loadConfigFile() {
        try {
            const response = await fetch('./documentos/structure.json');
            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            // Arquivo não existe ou não é acessível, não é um erro crítico
            console.log('Arquivo de configuração não encontrado, usando estrutura padrão');
            return null;
        }
    }
    
    /**
     * Retorna uma estrutura de arquivos padrão para demonstração
     */
    getDefaultStructure() {
        return {
            "README.md": {
                type: "file",
                path: "documentos/readme.md",
                name: "README.md"
            },
            "guia-inicio": {
                type: "folder",
                name: "guia-inicio",
                children: {
                    "introducao.md": {
                        type: "file",
                        path: "documentos/guia-inicio/introducao.md",
                        name: "introducao.md"
                    },
                    "instalacao.md": {
                        type: "file",
                        path: "documentos/guia-inicio/instalacao.md",
                        name: "instalacao.md"
                    },
                    "primeiro-projeto.md": {
                        type: "file",
                        path: "documentos/guia-inicio/primeiro-projeto.md",
                        name: "primeiro-projeto.md"
                    }
                }
            },
            "tutoriais": {
                type: "folder",
                name: "tutoriais",
                children: {
                    "javascript": {
                        type: "folder",
                        name: "javascript",
                        children: {
                            "fundamentos.md": {
                                type: "file",
                                path: "documentos/tutoriais/javascript/fundamentos.md",
                                name: "fundamentos.md"
                            },
                            "dom-manipulation.md": {
                                type: "file",
                                path: "documentos/tutoriais/javascript/dom-manipulation.md",
                                name: "dom-manipulation.md"
                            },
                            "async-await.md": {
                                type: "file",
                                path: "documentos/tutoriais/javascript/async-await.md",
                                name: "async-await.md"
                            }
                        }
                    },
                    "css": {
                        type: "folder",
                        name: "css",
                        children: {
                            "flexbox.md": {
                                type: "file",
                                path: "documentos/tutoriais/css/flexbox.md",
                                name: "flexbox.md"
                            },
                            "grid.md": {
                                type: "file",
                                path: "documentos/tutoriais/css/grid.md",
                                name: "grid.md"
                            },
                            "animations.md": {
                                type: "file",
                                path: "documentos/tutoriais/css/animations.md",
                                name: "animations.md"
                            }
                        }
                    }
                }
            },
            "api": {
                type: "folder",
                name: "api",
                children: {
                    "referencia.md": {
                        type: "file",
                        path: "documentos/api/referencia.md",
                        name: "referencia.md"
                    },
                    "exemplos.md": {
                        type: "file",
                        path: "documentos/api/exemplos.md",
                        name: "exemplos.md"
                    }
                }
            },
            "changelog.md": {
                type: "file",
                path: "documentos/changelog.md",
                name: "changelog.md"
            }
        };
    }
    
    /**
     * Configura os listeners de eventos
     */
    setupEventListeners() {
        // Listener para busca de arquivos
        const searchInput = document.getElementById('file-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
        
        // Listener para botão de refresh
        const refreshButton = document.getElementById('refresh-files');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                this.refreshFileStructure();
            });
        }
    }
    
    /**
     * Lida com a busca de arquivos
     */
    handleSearch(searchTerm) {
        this.searchTerm = searchTerm.toLowerCase().trim();
        
        if (this.searchTerm === '') {
            this.filteredFiles = { ...this.fileStructure };
        } else {
            this.filteredFiles = this.filterFiles(this.fileStructure, this.searchTerm);
        }
        
        this.renderFileTree();
        this.dispatchEvent(this.events.searchUpdated, { searchTerm: this.searchTerm });
    }
    
    /**
     * Filtra arquivos baseado no termo de busca
     */
    filterFiles(structure, searchTerm) {
        const filtered = {};
        
        for (const [key, item] of Object.entries(structure)) {
            if (item.type === 'file') {
                if (item.name.toLowerCase().includes(searchTerm)) {
                    filtered[key] = item;
                }
            } else if (item.type === 'folder') {
                const filteredChildren = this.filterFiles(item.children, searchTerm);
                const folderMatches = item.name.toLowerCase().includes(searchTerm);
                
                if (Object.keys(filteredChildren).length > 0 || folderMatches) {
                    filtered[key] = {
                        ...item,
                        children: filteredChildren
                    };
                }
            }
        }
        
        return filtered;
    }
    
    /**
     * Renderiza a árvore de arquivos no DOM
     */
    renderFileTree() {
        const fileTreeContainer = document.getElementById('file-tree');
        if (!fileTreeContainer) return;
        
        // Limpa o container
        fileTreeContainer.innerHTML = '';
        
        if (Object.keys(this.filteredFiles).length === 0) {
            this.showEmptyState(fileTreeContainer);
            return;
        }
        
        // Renderiza a estrutura
        this.renderItems(this.filteredFiles, fileTreeContainer);
    }
    
    /**
     * Renderiza itens da estrutura de arquivos
     */
    renderItems(items, container, level = 0) {
        for (const [, item] of Object.entries(items)) {
            const element = this.createItemElement(item, level);
            container.appendChild(element);
            
            if (item.type === 'folder' && item.children) {
                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'folder-children';
                childrenContainer.style.display = 'block'; // Por padrão, mostrar expandido
                
                this.renderItems(item.children, childrenContainer, level + 1);
                container.appendChild(childrenContainer);
            }
        }
    }
    
    /**
     * Cria elemento DOM para um item (arquivo ou pasta)
     */
    createItemElement(item, level) {
        const element = document.createElement('div');
        element.className = item.type === 'file' ? 'file-item' : 'folder-item';
        element.style.paddingLeft = `${1 + (level * 1.5)}rem`;
        element.setAttribute('role', item.type === 'folder' ? 'treeitem' : 'button');
        element.setAttribute('tabindex', '0');
        
        // Ícone
        const icon = document.createElement('i');
        icon.className = item.type === 'file' ? 'fas fa-file-alt' : 'fas fa-folder';
        
        // Nome
        const name = document.createElement('span');
        name.className = item.type === 'file' ? 'file-name' : 'folder-name';
        name.textContent = item.name;
        
        element.appendChild(icon);
        element.appendChild(name);
        
        // Event listeners
        if (item.type === 'file') {
            element.addEventListener('click', () => {
                this.selectFile(item);
            });
            
            element.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectFile(item);
                }
            });
        } else {
            element.addEventListener('click', () => {
                this.toggleFolder(element, icon);
            });
            
            element.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleFolder(element, icon);
                }
            });
        }
        
        return element;
    }
    
    /**
     * Alterna a expansão de uma pasta
     */
    toggleFolder(folderElement, iconElement) {
        const nextSibling = folderElement.nextElementSibling;
        if (nextSibling?.classList.contains('folder-children')) {
            const isHidden = nextSibling.style.display === 'none';
            nextSibling.style.display = isHidden ? 'block' : 'none';
            iconElement.className = isHidden ? 'fas fa-folder-open' : 'fas fa-folder';
        }
    }
    
    /**
     * Seleciona um arquivo
     */
    selectFile(file) {
        // Remove seleção anterior
        const previousSelected = document.querySelector('.file-item.active');
        if (previousSelected) {
            previousSelected.classList.remove('active');
        }
        
        // Adiciona seleção atual
        const fileElements = document.querySelectorAll('.file-item');
        for (const element of fileElements) {
            if (element.querySelector('.file-name').textContent === file.name) {
                element.classList.add('active');
                break;
            }
        }
        
        this.currentPath = file.path;
        this.dispatchEvent(this.events.fileSelected, { file, path: file.path });
    }
    
    /**
     * Mostra estado vazio quando não há arquivos
     */
    showEmptyState(container) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <div style="padding: 2rem 1rem; text-align: center; color: var(--text-muted);">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                <p>Nenhum arquivo encontrado</p>
                <small>Tente um termo de busca diferente</small>
            </div>
        `;
        container.appendChild(emptyState);
    }
    
    /**
     * Mostra erro na interface
     */
    showError(message) {
        const fileTreeContainer = document.getElementById('file-tree');
        if (fileTreeContainer) {
            fileTreeContainer.innerHTML = `
                <div class="error-state" style="padding: 2rem 1rem; text-align: center; color: var(--text-muted);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; display: block; color: #ef4444;"></i>
                    <p>${message}</p>
                    <button onclick="fileManager.refreshFileStructure()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Tentar novamente
                    </button>
                </div>
            `;
        }
    }
    
    /**
     * Atualiza a estrutura de arquivos
     */
    async refreshFileStructure() {
        const refreshButton = document.getElementById('refresh-files');
        if (refreshButton) {
            const icon = refreshButton.querySelector('i');
            icon.classList.add('fa-spin');
        }
        
        // Limpa o cache
        this.cache.clear();
        
        try {
            // Se estiver usando carregador dinâmico, recarrega da pasta
            if (this.useDynamicLoader && this.dynamicLoader) {
                const structure = await this.dynamicLoader.refresh();
                if (structure) {
                    this.fileStructure = structure;
                    this.filteredFiles = { ...this.fileStructure };
                    this.renderFileTree();
                    this.dispatchEvent(this.events.structureLoaded, { 
                        structure: this.fileStructure,
                        dynamic: true 
                    });
                }
            } else {
                // Senão, recarrega do structure.json
                await this.loadStaticStructure();
            }
        } finally {
            if (refreshButton) {
                const icon = refreshButton.querySelector('i');
                icon.classList.remove('fa-spin');
            }
        }
    }
    
    /**
     * Obtém o caminho de breadcrumb para um arquivo
     */
    getBreadcrumbPath(filePath) {
        if (!filePath) return [];
        
        const parts = filePath.replace('documentos/', '').split('/');
        const breadcrumbs = [];
        let currentPath = 'documentos';
        
        breadcrumbs.push({ name: 'Documentos', path: 'documentos' });
        
        for (let i = 0; i < parts.length - 1; i++) {
            currentPath += '/' + parts[i];
            breadcrumbs.push({
                name: parts[i],
                path: currentPath
            });
        }
        
        return breadcrumbs;
    }
    
    /**
     * Obtém informações de um arquivo
     */
    getFileInfo(filePath) {
        const cached = this.cache.get(filePath);
        if (cached) return cached;
        
        // Simulação de metadados do arquivo
        const info = {
            path: filePath,
            name: filePath.split('/').pop(),
            extension: filePath.split('.').pop(),
            size: Math.floor(Math.random() * 10000) + 1000, // Tamanho simulado
            lastModified: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
        };
        
        this.cache.set(filePath, info);
        return info;
    }
    
    /**
     * Dispara evento customizado
     */
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
    
    /**
     * Obtém a estrutura atual de arquivos
     */
    getFileStructure() {
        return this.fileStructure;
    }
    
    /**
     * Obtém o arquivo atualmente selecionado
     */
    getCurrentFile() {
        return this.currentPath;
    }
}

// Torna a classe disponível globalmente
window.FileManager = FileManager;