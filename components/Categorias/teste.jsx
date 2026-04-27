import Link from "next/link"
import { Button, Modal, Accordion } from "flowbite-react"
import React, { useState } from "react"

const Categorias = (props) => {
  return (
    <section className="bg-gradient-to-r from-indigo-100 via-purple-200 to-pink-200 text-gray-800 body-font py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="sm:text-4xl text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 mb-6">
            CATEGORIAS DE PRÊMIOS
          </h1>
          <p className="text-lg text-gray-700">
            Explore as diversas categorias de prêmios disponíveis para você.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {props.dados.map((value, index) => (
            <article
              key={index}
              className="w-full sm:w-1/2 lg:w-1/3 p-4"
              id={`modal${index}`}
            >
              <div className="bg-white shadow-lg rounded-lg p-6 transform transition-all hover:scale-105 hover:shadow-xl duration-300">
                <div className="flex items-center mb-4">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    className="text-indigo-500 w-8 h-8 flex-shrink-0 mr-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                    <path d="M22 4L12 14.01l-3-3"></path>
                  </svg>
                  <span className="title-font text-xl font-medium text-gray-900">
                    <Link href={`/regulamentos#${value.slug}`} passHref>
                      <Button className="text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg font-medium">
                        {value.titulo}
                      </Button>
                    </Link>
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {value.description ||
                    "Clique para mais detalhes sobre esta categoria."}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categorias
