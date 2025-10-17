/**
 * Classe para gerenciar componentes Select2 com busca AJAX e dependência em cascata.
 * * Para usar no HTML, adicione os seguintes atributos de dados a uma tag <select>:
 * - data-list: O nome da lista a ser buscada pela API. (Obrigatório)
 * - data-url: A URL do endpoint da API. (Obrigatório)
 * - data-dependent: O ID do <select> "pai" do qual este depende. (Opcional)
 * - data-placeholder: O texto do placeholder. (Opcional)
 */
class Select2Component {
    constructor(element) {
        this.element = $(element);
        this.config = this.readConfig();

        // Define o valor inicial do cascade lendo o valor do elemento dependente no momento do carregamento.
        this.currentCascadeValue = this.getDependentValue();

        this.initialize();
        this.bindEvents();
    }

    /**
     * Lê as configurações a partir dos atributos data-* do elemento HTML.
     */
    readConfig() {
        return {
            list: this.element.data('list'),
            dependent: this.element.data('dependent'), // ID do elemento pai
            url: this.element.data('url'),
            placeholder: this.element.data('placeholder') || 'Selecione...',
        };
    }

    /**
     * Helper para obter o valor atual do elemento dependente.
     * @returns {string|null} O valor do elemento dependente ou null.
     */
    getDependentValue() {
        if (!this.config.dependent) {
            return null;
        }
        return $(`#${this.config.dependent}`).val() || null;
    }

    /**
     * Inicializa ou re-inicializa a instância do Select2 no elemento.
     * Sempre usa o valor mais recente de `this.currentCascadeValue`.
     */
    initialize() {
        // Se já existe uma instância do Select2, destrói-a antes de criar uma nova.
        if (this.element.hasClass('select2-hidden-accessible')) {
            this.element.select2('destroy');
        }

        this.element.select2({
            theme: 'bootstrap-5',
            placeholder: this.config.placeholder,
            allowClear: true,
            minimumInputLength: 0,
            language: {
                searching: () => 'Buscando...',
                loadingMore: () => 'Carregando mais resultados...',
                noResults: () => 'Nenhum resultado encontrado',
                errorLoading: () => 'Não foi possível carregar os resultados.',
            },
            ajax: {
                url: this.config.url,
                dataType: 'json',
                delay: 250,
                // A arrow function garante que `this` se refere à instância de `Select2Component`
                data: (params) => {
                    const requestData = {
                        lista: this.config.list,
                        busca: params.term || '',
                        page: params.page || 1,
                    };

                    // Adiciona o parâmetro cascade se um valor dependente estiver definido
                    if (this.currentCascadeValue) {
                        requestData.cascade = this.currentCascadeValue;
                    }

                    return requestData;
                },
                processResults: (response, params) => {
                    const results = Array.isArray(response.data) ? response.data.map(item => ({
                        id: item.id,
                        text: item.name
                    })) : [];

                    params.page = params.page || 1;
                    return {
                        results: results,
                        pagination: {
                            more: response.meta && (params.page * response.meta.per_page) < response.meta.total,
                        },
                    };
                },
                cache: true,
            },
        });
    }

    /**
     * Vincula os eventos de mudança ao elemento dependente, se houver.
     */
    bindEvents() {
        if (!this.config.dependent) {
            return;
        }

        const $dependentElement = $(`#${this.config.dependent}`);

        // Ouve o evento 'change' no elemento pai.
        // Este evento é disparado pelo Select2 tanto ao selecionar quanto ao limpar um item.
        $dependentElement.on('change', (e) => {
            // 1. Atualiza o estado do cascade no componente filho com o novo valor do pai.
            this.currentCascadeValue = $dependentElement.val() || null;

            // 2. Limpa o valor do select filho.
            this.element.val(null).trigger('change');

            // 3. Re-inicializa o select2 filho para que ele use a nova configuração AJAX (com o novo cascade).
            this.initialize();
        });
    }
}

/**
 * Inicializador global.
 * Procura por todos os elementos com o atributo `data-list` e cria uma nova instância de Select2Component para cada um.
 */
$(function () {
    $('[data-list]').each(function () {
        new Select2Component(this);
    });
});
