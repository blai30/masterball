'use client'

export default function Header() {
  return (
    <header className="flex flex-row gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="language" className="text-black dark:text-white">
          Language
        </label>
        <select id="language" name="language" className="">
          <option value="en">en</option>
        </select>
      </div>
    </header>
  )
}
