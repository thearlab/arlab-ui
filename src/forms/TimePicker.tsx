'use client';
import { useMemo } from 'react';
import { parseTime } from '../lib/dates';
import { timeSteps } from '../lib/forms';
import { ClockIcon } from '../core/icons';
import { Combobox, type ComboboxProps } from './Combobox';

export interface TimePickerProps extends Omit<ComboboxProps, 'options' | 'allowCustom' | 'normalize' | 'filter' | 'icon'> {
  /** Minutes between suggestions: 15 or 30 (default). */
  step?: 15 | 30 | 60;
  /** First and last suggestion, 'HH:MM'. */
  start?: string;
  end?: string;
}

/** A time, 24 h 'HH:MM'. Type it ("9", "9:30", "9.30 pm") or pick from steps of 15 or 30 minutes. */
export function TimePicker({ step = 30, start = '00:00', end = '23:59', placeholder = 'hh:mm', ...rest }: TimePickerProps) {
  const options = useMemo(() => timeSteps(step, start, end).map((t) => ({ value: t, label: t })), [step, start, end]);
  return <Combobox {...rest} options={options} allowCustom normalize={parseTime} filter placeholder={placeholder} icon={<ClockIcon size={16} />} />;
}
