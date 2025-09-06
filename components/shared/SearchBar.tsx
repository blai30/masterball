'use client'

import React from 'react'
import clsx from 'clsx/lite'
import { Search } from 'lucide-react'
import { Input, InputGroup } from '@/components/ui/catalyst/input'

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
    <InputGroup className={clsx('relative', className)}>
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
