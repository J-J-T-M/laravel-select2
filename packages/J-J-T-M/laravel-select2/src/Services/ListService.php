<?php

namespace App\Services;

use App\Interfaces\ListInterface;
use App\Exceptions\InvalidListException;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ListService
{
    /**
     * @throws InvalidListException
     */
    public function returnList(string $listKey, ?string $search, int|string|null $cascade = null): ResourceCollection
    {
        $modelClass = config("lists.{$listKey}");

        if (!$modelClass) {
            throw new InvalidListException("A lista '{$listKey}' não foi encontrada.");
        }

        if (!is_subclass_of($modelClass, ListInterface::class)) {
            throw new InvalidListException("A lista '{$listKey}' não está configurada corretamente.");
        }

        return $modelClass::getList($search, $cascade);
    }
}