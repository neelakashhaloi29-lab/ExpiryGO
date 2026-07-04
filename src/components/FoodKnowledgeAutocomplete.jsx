function FoodKnowledgeAutocomplete({
  label,
  value,
  placeholder,
  suggestions,
  onChange,
  onSelectSuggestion,
  helperText,
}) {
  const hasSuggestions = suggestions.length > 0;

  return (
    <div className="field field-full autocomplete-field">
      <label className="field">
        <span>{label}</span>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
      </label>

      {helperText && <p className="autocomplete-helper">{helperText}</p>}

      {hasSuggestions && (
        <div className="autocomplete-panel" role="listbox" aria-label="Food suggestions">
          {suggestions.map((food) => (
            <button
              key={food.id}
              type="button"
              className="autocomplete-item"
              onClick={() => onSelectSuggestion(food)}
            >
              <span className="autocomplete-item-name">{food.name}</span>
              <span className="autocomplete-item-meta">
                {food.category} · {food.defaultQuantity} {food.defaultUnit}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FoodKnowledgeAutocomplete;
