class Select2Component {
    constructor(element) {
        this.element = $(element);
        this.config = this.readConfig();
        this.initialize();
        this.bindEvents();
    }

    readConfig() {
        return {
            list: this.element.data('list'),
            dependent: this.element.data('dependent'),
            cascadeValue: this.element.data('value') || null,
            url: this.element.data('url'),
            placeholder: this.element.data('placeholder') || 'Selecione...',
        };
    }

    initialize(cascadeValue = null) {
        const currentCascadeValue = cascadeValue !== null ? cascadeValue : this.config.cascadeValue;

        this.element.select2('destroy').select2({
            theme: 'bootstrap-5',
            placeholder: this.config.placeholder,
            allowClear: true,
            minimumInputLength: currentCascadeValue ? 0 : 3,
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
                data: (params) => ({
                    lista: this.config.list,
                    busca: params.term || '',
                    page: params.page || 1,
                    cascade: currentCascadeValue,
                }),
                processResults: (response, params) => {
                    params.page = params.page || 1;
                    return {
                        // Mapeia o array de resultados para que a propriedade 'name'
                        // da sua API seja renomeada para 'text', que é o que o Select2 espera.
                        results: response.data.map(item => ({
                            id: item.id,
                            text: item.name
                        })),
                        pagination: {
                            more: (params.page * response.meta.per_page) < response.meta.total,
                        },
                    };
                },
                cache: true,
                transport: (params, success, failure) => {
                    const $request = $.ajax(params);
                    $request.then(success);
                    $request.fail(failure);
                    return $request;
                },
            },
        });
    }

    bindEvents() {
        if (!this.config.dependent) {
            return;
        }

        const $dependentElement = $(`#${this.config.dependent}`);

        $dependentElement.on('select2:select', (e) => {
            const newCascadeValue = e.params.data.id;
            this.element.empty().trigger('change');
            this.initialize(newCascadeValue);
        });

        $dependentElement.on('select2:unselect', () => {
            this.element.empty().trigger('change');
            this.initialize(null);
        });
    }
}

// Inicializador
$(function () {
    $('[data-list]').each(function () {
        new Select2Component(this);
    });
});