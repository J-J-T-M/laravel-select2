<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Mapeamento de Listas para o Componente Select2
    |--------------------------------------------------------------------------
    |
    | Defina aqui as chaves que serão usadas no frontend e qual Model
    | elas representam. Isso centraliza a configuração e facilita a adição
    | de novas listas sem precisar alterar a classe de serviço.
    |
    */

    'slaughterBook' => \App\Models\SlaughterBook::class,
    'city'      => \App\Models\City::class,
    // Adicione outros models permitidos aqui
];
