# Componente Select2 Dinâmico para Laravel

[![Latest Version on Packagist](https://img.shields.io/packagist/v/seu-nome/laravel-select2.svg?style=flat-square)](https://packagist.org/packages/seu-nome/laravel-select2)
[![Total Downloads](https://img.shields.io/packagist/dt/seu-nome/laravel-select2.svg?style=flat-square)](https://packagist.org/packages/seu-nome/laravel-select2)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Um componente Blade robusto e reutilizável que integra a biblioteca Select2 com o backend Laravel para criar selects dinâmicos com busca via AJAX, paginação (rolagem infinita) e suporte a selects dependentes (cascata).

## Funcionalidades

- **Busca por AJAX:** Carrega dados de forma assíncrona, ideal para listas grandes.
- **Paginação Automática:** Suporte a "rolagem infinita" para melhor performance.
- **Selects Dependentes:** Crie selects em cascata (ex: Estado -> Cidade) de forma simples.
- **Configuração Centralizada:** Gerencie todas as suas listas em um único arquivo de configuração.
- **Componente Blade:** Fácil de usar em suas views com a sintaxe `<x-select2 />`.
- **Seguro e Otimizado:** Construído com boas práticas de segurança e performance em mente.

## Instalação

**Pré-requisitos:**
- Laravel 11+
- PHP 8.2+
- jQuery
- Select2 (v4+)

**1. Instale o pacote via Composer:**

```bash
composer require seu-nome/laravel-select2
```

**2. Publique os arquivos de configuração e assets:**

Este comando irá copiar o arquivo de configuração `lists.php` para a pasta `config/` do seu projeto e o arquivo JavaScript para `public/vendor/laravel-select2/`.

```bash
php artisan vendor:publish --provider="SeuNome\LaravelSelect2\Providers\Select2ServiceProvider"
```

**3. Inclua os assets no seu layout:**

No seu arquivo de layout principal (ex: `resources/views/layouts/app.blade.php`), certifique-se de incluir o jQuery, a biblioteca Select2 (CSS e JS) e o script do nosso componente.

```html
<html>
<head>
    ...
    <link href="[https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css](https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css)" rel="stylesheet" />
    <link rel="stylesheet" href="[https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css](https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css)" />
    ...
</head>
<body>
    ...

    <script src="[https://code.jquery.com/jquery-3.7.1.min.js](https://code.jquery.com/jquery-3.7.1.min.js)"></script>
    <script src="[https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js](https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js)"></script>
    <script src="{{ asset('vendor/laravel-select2/component-select2.js') }}"></script>
</body>
</html>
```

## Configuração

Após publicar os arquivos, edite `config/lists.php` para mapear as "chaves" que você usará no componente para os seus Models do Eloquent. O Model correspondente deve implementar a interface `ListInterface`.

```php
// config/lists.php

return [
    'city' => \App\Models\City::class,
    'supplier' => \App\Models\Supplier::class,
];
```

## Uso

### 1. Preparando o Model

Seu Model precisa implementar a `SeuNome\LaravelSelect2\Interfaces\ListInterface`, que exige um método estático `getList`. Este método conterá a lógica para buscar e filtrar os dados.

**Exemplo: `app/Models/City.php`**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use SeuNome\LaravelSelect2\Interfaces\ListInterface;
use SeuNome\LaravelSelect2\Resources\ListCollection;
use SeuNome\LaravelSelect2\Resources\ListResource;

class City extends Model implements ListInterface
{
    // Accessor para formatar o texto (ex: "Cuiabá - MT")
    protected function displayText(): Attribute
    {
        return Attribute::make(
            get: fn () => "{$this->name} - {$this->state_uf}",
        );
    }
    
    // Scope para a lógica da query
    public function scopeSearchAndFilter(Builder $query, ?string $search, $cascade): Builder
    {
        return $query->where(function ($subQuery) use ($search) {
            if (!empty($search)) {
                $subQuery->where('name', 'LIKE', '%' . $search . '%');
            }
        })
        ->when($cascade, function ($q, $cascadeValue) {
            // 'cascade' aqui é o ID do estado (UF)
            $q->where('state_id', $cascadeValue);
        });
    }

    // Implementação do método da interface
    static public function getList(string $search, int|string|null $cascade = null): ListCollection
    {
        ListResource::$textField = 'display_text';

        $results = self::query()
            ->searchAndFilter($search, $cascade)
            ->select(['id', 'name', 'state_uf'])
            ->paginate(20);

        return new ListCollection($results);
    }
}
```

### 2. Usando o Componente na View Blade

Agora você pode usar o componente em qualquer view.

**Exemplo Básico (Select de Fornecedores)**

```blade
<x-select2 
    id="supplier_id" 
    name="supplier_id" 
    key="supplier"
    nameLabel="Fornecedor"
    selectValue="{{ old('supplier_id', $product->supplier_id ?? '') }}"
    selectText="{{ $product->supplier->name ?? '' }}"
    placeholder="Selecione um fornecedor"
/>
```

**Exemplo Avançado (Select Dependente de Estado -> Cidade)**

```blade
<div>
    <label for="state_id" class="form-label">Estado</label>
    <select name="state_id" id="state_id" class="form-select">
        <option value="">Selecione</option>
        @foreach($states as $state)
            <option value="{{ $state->id }}" @selected(old('state_id') == $state->id)>
                {{ $state->name }}
            </option>
        @endforeach
    </select>
</div>

<div>
    <x-select2 
        id="city_id"
        name="city_id"
        key="city"
        nameLabel="Cidade"
        dependent="state_id"  selectValue="{{ old('city_id', $address->city_id ?? '') }}"
        selectText="{{ $address->city->display_text ?? '' }}"
        placeholder="Primeiro selecione um estado"
    />
</div>
```

#### Atributos Disponíveis

- `id` (string, required): O `id` HTML do elemento `<select>`.
- `key` (string, required): A chave definida em `config/lists.php`.
- `name` (string, optional): O atributo `name` do select. Se omitido, usa o `id`.
- `nameLabel` (string, optional): O texto a ser exibido na `<label>`.
- `dependent` (string, optional): O `id` do campo select do qual este componente depende.
- `selectValue` (mixed, optional): O valor (ID) do item que deve vir pré-selecionado.
- `selectText` (string, optional): O texto do item que deve vir pré-selecionado.
- `placeholder` (string, optional): O texto de placeholder do select.


```
