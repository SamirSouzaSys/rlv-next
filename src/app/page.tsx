"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface INoticias {
  count: number
  page: number
  totalPages: number
  nextPage: number
  previousPage: number
  showingFrom: number
  showingTo: number
  items: [INoticiaItem]
}
interface INoticiaItem {
  id: number
  tipo: string
  titulo: string
  introducao: string
  data_publicacao: string
  produto_id: number
  produtos: string
  editorias: string
  imagens: string
  produtos_relacionados: string
  destaque: boolean
  link: string
  [key: string]: string | number | boolean
}

const apiAddress = "http://servicodados.ibge.gov.br/api/v3/noticias"

const fetchNoticias = async (
  paginaAtual: number = 1,
  tituloPesquisa: string = ""
): Promise<INoticias> => {
  const qtd = 3
  const page = paginaAtual

  return await fetch(
    apiAddress + "?page=" + page + "&qtd=" + qtd + "&busca=" + tituloPesquisas
  ).then((res) => res.json())
}

export default function Home() {
  const [page, setPage] = useState(1)
  const [busca, setBusca] = useState("")
  const router = useRouter()

  const {
    data: noticias,
    isLoading,
    isError,
    isPlaceholderData,
  } = useQuery<INoticias>({
    queryKey: ["INoticiaItem", page, busca],
    queryFn: () => fetchNoticias(page, busca),
    placeholderData: keepPreviousData,
  })

  const buildQueryParams = (item: INoticiaItem) => {
    const queryString = Object.keys(item)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(item[key]))}`
      )
      .join("&")

    router.push(`/noticia?${queryString}`)
  }

  const { register, handleSubmit } = useForm({
    defaultValues: {
      tituloBuscar: "",
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: Falha ao buscar os dados</div>

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-2xl font-bold text-center mb-4 ">IBGE Notícias</h1>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <span className="block text-sm font-bold text-gray-700 mb-2">
          Página atual: {page}
        </span>

        <span className="block text-sm font-bold text-gray-700 mb-2">
          Total de páginas: {noticias?.totalPages}
        </span>
        <br />
        <button
          className="middle none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          onClick={() => {
            setPage(1)
          }}
          // Desabilita o botão "Primeira" se já tiver na primeira página
          disabled={page == 1}
        >
          Primeira
        </button>

        <button
          className="middle none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          onClick={() => setPage((old) => Math.max(old - 1, 0))}
          disabled={page === 1}
        >
          Anterior
        </button>

        <button
          className="middle none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          onClick={() => {
            if (!isPlaceholderData && noticias?.nextPage) {
              setPage((old) => old + 1)
            }
          }}
          // Desabilita o botão "Próximo" até saber se há uma próxima página disponível
          disabled={isPlaceholderData || !noticias?.nextPage}
        >
          Próximo
        </button>

        <button
          className="middle none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          onClick={() => {
            setPage(noticias?.totalPages ? noticias?.totalPages : 1)
          }}
          // Desabilita o botão "última" se já tiver na última página
          disabled={noticias?.totalPages == page}
        >
          Última
        </button>
      </div>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mt-8">
        <form
          onSubmit={handleSubmit((data) => {
            setPage(1)
            setBusca(data.tituloBuscar)
          })}
        >
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Buscar pelo título
          </label>
          <input
            className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="texto para pesquisa"
            {...register("tituloBuscar")}
          />
          <input
            type="submit"
            value="Buscar!"
            className="middle none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          />
        </form>
      </div>

      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mt-8">
        {noticias?.items.slice(0, 10).map((item: INoticiaItem) => (
          <div className="mb-8" key={item.id}>
            <div className="mb-4">
              <strong>{item.titulo}</strong>
              <p
                className="overflow: hidden; 
white-space: nowrap; "
              >
                {item.introducao}
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => buildQueryParams(item)}
                className="text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                block  
                font-bold
                mb-2
                "
              >
                Ler Mais aqui mesmo!
              </button>
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 block   font-bold mb-2"
              >
                Ler Mais no site oficial!
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
