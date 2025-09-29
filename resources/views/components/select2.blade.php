<label for="{{ $id }}" class="form-label {{ $labelClass ?? '' }}">{{ $nameLabel ?? ucfirst($key) }}</label>
<select
    name="{{ $name ?? $id }}"
    id="{{ $id }}"
    data-list="{{ $key }}"
    data-dependent="{{ $dependent }}"
    data-value="{{ $dependentValue }}"
    data-url="{{ route('list.search') }}"
    data-placeholder="{{ $placeholder ?? 'Selecione uma opção' }}"
    class="form-control col-md-12 select2 @error($id) is-invalid @enderror">

    @if($selectValue && $selectText)
        <option value="{{ $selectValue }}" selected>{{ $selectText }}</option>
    @endif
</select>
@error($id)
    <div class="invalid-feedback">{{ $message }}</div>
@enderror