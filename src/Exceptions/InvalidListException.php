<?php

namespace App\Exceptions;

use Exception;

/**
 * Esta classe representa um erro específico para quando uma lista
 * do componente Select2 é inválida.
 *
 * Ela não precisa de conteúdo adicional porque:
 * 1. Herda tudo o que precisa (mensagem, código, etc.) da classe `Exception` do PHP.
 * 2. Seu principal objetivo é servir como um "tipo" específico para que o
 * Handler.php possa identificá-la e dar um tratamento customizado.
 */
class InvalidListException extends Exception
{
    // Vazio é intencional e correto para este cenário.
}