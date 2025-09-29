<?php

namespace App\Http\Controllers;

use App\Services\ListService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ListController extends Controller
{
    public function __invoke(Request $request, ListService $service)
    {
        $validated = $request->validate([
            'lista'   => ['required', 'string', Rule::in(array_keys(config('lists', [])))],
            'busca'   => ['nullable', 'string'],
            'cascade' => ['nullable'],
            'page'    => ['nullable', 'integer'],
        ]);

        return $service->returnList(
            $validated['lista'],
            $validated['busca'] ?? '',
            $validated['cascade'] ?? null
        );
    }
}