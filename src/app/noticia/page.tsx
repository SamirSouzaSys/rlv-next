"use client"

import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function Page() {
  const searchParams = useSearchParams()

  const titulo: string = searchParams.get("titulo") ?? ""
  const introducao: string | null = searchParams.get("introducao")
  const data_publicacao: string | null = searchParams.get("data_publicacao")
  const imagens: string = searchParams.get("imagens") ?? ""

  const inicioURLImagemInicio = imagens
    ? imagens.indexOf('"image_intro":"') + '"image_intro":"'.length
    : 0

  const fimURLImagemInicio = imagens
    ? imagens.indexOf('","', inicioURLImagemInicio)
    : 0
  const imageIntroURL =
    imagens && imagens.slice(inicioURLImagemInicio, fimURLImagemInicio)
  const link: string | null = searchParams.get("link") ?? ""
  const urlNoticia = link && new URL(link)
  const domain = urlNoticia && urlNoticia.hostname

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-2xl font-bold text-center mb-4 ">IBGE Notícias</h1>
      <h2 className="text-2xl font-bold text-center mb-4 ">Notícia</h2>
      <p className="font-bold">{titulo}</p>
      <br />
      <br />
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="mb-4">
          <p className="font-bold">Introdução:</p>
          {introducao}
        </div>
        <div className="mb-4">
          <p className="font-bold">Introdução:</p>
          {introducao}
        </div>
        <div className="mb-4">
          <span className="font-bold">Data publicação: </span>
          {data_publicacao}
        </div>
        <Image
          src={`https://${domain}/${imageIntroURL}`}
          width={320}
          height={180}
          alt="imagem da notícia"
          className="mb-10"
        />
        <div>
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 block   font-bold mb-2"
          >
            Ler Mais no site oficial!
          </Link>
        </div>
        <div>
          <Link
            href={"/"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 block   font-bold mb-2"
          >
            Voltar para a tela inicial
          </Link>
        </div>
      </div>
    </main>
  )
}
