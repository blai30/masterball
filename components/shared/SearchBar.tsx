'use client'

import React from 'react'
import { Search } from 'lucide-react'
import { Field, Label } from '@/components/ui/fieldset'
import { Input, InputGroup } from '@/components/ui/input'

type SearchBarProps = {
  value: string
  onChangeAction: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SearchBar({
  value,
  onChangeAction,
  placeholder = 'Search...',
  className,
}: SearchBarProps) {
  return (
    <InputGroup className="relative">
      <Search size={16} data-slot="icon" />
      <Input
        id="search"
        name="search"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChangeAction(e.target.value)}
        className="max-w-sm"
      />
    </InputGroup>
  )
}
