'use client'

import { useLanguage } from '@/lib/LanguageContext'

const translatedHeading: Record<string, string> = {
  ['en']: '404 Page Not Found',
  ['ja']: '404 Peiji natto faundo',
}

const translatedBody: Record<string, string> = {
  ['en']:
    'OOPSIE WOOPSIE!! Uwu We made a f*cky wucky!! A wittle f*cko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!',
  ['ja']:
    'OOPSIE WOOPSIE!! Uwu We meido a f*kki wukki!! A wittoru f*kko boingo! Za coudo monkii ato auru heddokuaataazu aa wookingu BEWII HAWDO tsu fikusu dissu!',
}

export default function NotFound() {
  const { language } = useLanguage()

  return (
    <div className="container mx-auto flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="p-8 text-center text-4xl font-bold text-pretty">
        {translatedHeading[language]}
      </h1>
      <p className="px-8 text-center text-xl leading-12 font-light text-pretty">
        {translatedBody[language]}
      </p>
    </div>
  )
}
