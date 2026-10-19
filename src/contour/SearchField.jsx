import React, {useRef} from "react";
import {Search, X} from "lucide-react";
import {Input} from "./BaseFields.js";
import {IconButton} from "./ui.js";

/** @param {Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "onChange"> & { label?: string; inputRef?: import("react").RefObject<HTMLInputElement>; onChange: (event: any) => void }} props */
export function SearchField({
  value,
  onChange,
  label = "Search",
  placeholder = label,
  inputRef = undefined,
  ...inputProps
}) {
  const ownRef=useRef(null),fieldRef=inputRef || ownRef;
  return (
    <div className="search-field">
      <Search size={16} />
      <Input {...inputProps} inputRef={fieldRef} variant="embedded"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {value && (
        <IconButton
          label="Clear search"
          className="ct-search-clear"
          disabled={inputProps.disabled}
          onClick={() => {onChange({ target: { value: "" } });fieldRef.current?.focus();}}
        >
          <X size={12} />
        </IconButton>
      )}
    </div>
  );
}
