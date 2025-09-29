<?php

namespace App\View\Components;

use Closure;
use Illuminate\View\Component;
use Illuminate\Contracts\View\View;

class Select2 extends Component
{
    public function __construct(
        public string $id,
        public string $key,
        public ?string $name = null,
        public ?string $dependent = null,
        public $dependentValue = null,
        public ?string $nameLabel = null,
        public ?string $labelClass = null,
        public $selectValue = null,
        public ?string $selectText = null,
        public ?string $placeholder = null
    ) {
    }

    public function render(): View|Closure|string
    {
        return view('components.select2');
    }
}