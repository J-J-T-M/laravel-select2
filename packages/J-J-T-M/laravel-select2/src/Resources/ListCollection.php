<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ListCollection extends ResourceCollection
{
    public $collects = ListResource::class;

    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}