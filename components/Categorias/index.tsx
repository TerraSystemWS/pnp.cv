import Link from "next/link"
import React, { useState } from "react"

const Categorias = (props: any) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  return (
    <section className="bg-gradient-to-r from-gray-100 via-gray-300 to-[rgb(194,161,43)] text-gray-800 body-font py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="sm:text-4xl text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-6">
            CATEGORIAS DE PRÉMIO
          </h1>
          <p className="text-lg text-gray-600">
            Explore as categorias e descubra o que está esperando por si!
          </p>
        </div>

        {/* Grid de Categorias */}
        <div className="flex flex-wrap justify-center gap-12">
          {props.dados.map((value: any, index: any) => (
            <div
              key={index}
              className="relative group cursor-pointer rounded-lg bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:translate-y-[-5px] hover:bg-gray-200 flex flex-col justify-between w-72" // Definindo a largura fixa
              onMouseEnter={() => setExpandedCategory(value.slug)}
              onMouseLeave={() => setExpandedCategory(null)}
            >
              <Link href={`/regulamentos#${value.slug}`}>
                {/* Ícone ou imagem da categoria */}
                <div className="flex justify-center mb-4">
                  <img
                    src={value.url || "https://placehold.co/500x500"}
                    alt={value.titulo}
                    className="w-16 h-16 object-contain" // Usando object-contain para evitar truncamento
                  />
                </div>

                {/* Título da Categoria */}
                <h2 className="text-xl font-semibold text-center text-gray-800">
                  {value.titulo}
                </h2>

                {/* Descrição Expansível */}
                <div
                  className={`transition-all duration-300 ease-in-out opacity-0 ${
                    expandedCategory === value.slug ? "opacity-100" : ""
                  }`}
                >
                  <p className="text-gray-600 mt-2">{value.description}</p>
                  <Link
                    href={`/regulamentos#${value.slug}`}
                    className="text-yellow-500 font-medium mt-2 inline-block"
                  >
                    Saiba Mais
                  </Link>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categorias
