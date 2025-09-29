<?php

namespace App\Interfaces;

use Illuminate\Http\Resources\Json\ResourceCollection;

interface ListInterface
{
    static public function getList(string $search, int|string|null $cascade): ResourceCollection;
}