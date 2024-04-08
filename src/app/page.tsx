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

const fetchNoticias = async (paginaAtual: number = 1, tituloPesquisa: string = ''): Promise<INoticias> => {
  const qtd = 3
  const page = paginaAtual

  return await fetch(apiAddress + "?page=" + page + "&qtd=" + qtd+ "&busca=" + tituloPesquisa).then((res) =>
    res.json()
  )
}

export default function Home() {
  const [page, setPage] = useState(1)
  const [busca, setBusca] = useState('')
  const router = useRouter()

  const {
    data: noticias,
    isLoading,
    isError,
    isPlaceholderData,
  } = useQuery<INoticias>({
    queryKey: ["INoticiaItem", page, busca],
    queryFn: () => fetchNoticias(page,busca),
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

  const {
    register,
    handleSubmit,
  } = useForm({
    defaultValues: {
      tituloBuscar: "",
    }
  });

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: Falha ao buscar os dados</div>

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1>IBGE Notícias</h1>
      </div>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div>
          <span>Página atual: {page}</span>
          {' - '}
          <span>Total de páginas: {noticias?.totalPages}</span>
          <br />
          <button
            onClick={() => {
              setPage(1)
            }}
            // Desabilita o botão "Primeira" se já tiver na primeira página
            disabled={page == 1}
          >
            Primeira
          </button>
          {' - '}
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 0))}
            disabled={page === 1}
          >
            Anterior
          </button>{" "}
          {' - '}
          <button
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
          {' - '}
          <button
            onClick={() => {
              setPage(noticias?.totalPages ? noticias?.totalPages : 1)
            }}
            // Desabilita o botão "última" se já tiver na última página
            disabled={noticias?.totalPages == page}
          >
            Última
          </button>
        </div>
      </div>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <form
          onSubmit={handleSubmit((data) => {
            setPage(1)
            setBusca(data.tituloBuscar)
          })}
        >
          <label>Buscar pelo título</label>
          <input {...register("tituloBuscar")} />
          <input type="submit" value="Buscar!"/>
        </form>
      </div>

      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <ul>
          {noticias?.items.slice(0, 10).map((item: INoticiaItem) => (
            <>
              <li key={item.id}>
                <strong>{item.titulo}</strong>
                <p>{item.introducao}</p>
                <button type="button" onClick={() => buildQueryParams(item)}>
                  Ler Mais aqui mesmo!
                </button>
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ler Mais no site oficial!
                </Link>
              </li>
              <br />
            </>
          ))}
        </ul>
      </div>
    </main>
  )
}
