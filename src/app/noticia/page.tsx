"use client"

import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function Page() {
  const searchParams = useSearchParams()

  const titulo: string = searchParams.get("titulo") ?? ""
  const introducao: string | null = searchParams.get("introducao")
  const data_publicacao: string | null = searchParams.get("data_publicacao")
  const editorias: string | null = searchParams.get("editorias")
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
      <h1>IBGE Notícias</h1>
      <h2>Notícia</h2>
      <p>{titulo}</p>
      <br />
      <br />
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <ul>
          <li>Introdução: {introducao}</li>
          <li>Data publicação: {data_publicacao}</li>
          <li>Editorias: {editorias}</li>
          <Image
            src={`https://${domain}/${imageIntroURL}`}
            width={320}
            height={180}
            alt="imagem da notícia"
          ></Image>
          <li>
            <Link href={link} target="_blank" rel="noopener noreferrer">
              Ler Mais no site oficial!
            </Link>
          </li>
          <li>
            <Link href={"/"} target="_self" rel="noopener noreferrer">
              Voltar para a tela inicial
            </Link>
          </li>
        </ul>
      </div>
    </main>
  )
}
