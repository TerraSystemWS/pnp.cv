import Link from "next/link"
import { Alert } from "flowbite-react"
import { HiInformationCircle } from "react-icons/hi"

const Projetos = () => {
  return (
    <>
      <section className="text-gray-700 body-font bg-gradient-to-r from-[#e6e2d8] via-white to-[#e6e2d8]">
        <div className="container px-6 py-20 mx-auto">
          {/* Título e Descrição */}
          <div className="text-center mb-12">
            <h1 className="sm:text-4xl text-3xl font-semibold text-gray-800 mb-6">
              Prémio Público de Publicidade
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto text-justify">
              O Prémio Público de Publicidade é uma categoria do Prémio Nacional
              de Publicidade (PNP) em que a votação é feita exclusivamente pelo
              público, através da internet. Este prémio é da responsabilidade do
              PNP, com regulamento próprio, sem avaliação do júri, sendo baseado
              unicamente na popularidade. A votação online torna este prémio
              mais inclusivo e acessível para todos os cidadãos, incentivando a
              participação direta no reconhecimento da publicidade mais
              impactante.
            </p>
          </div>

          {/* Alerta de Disponibilidade */}
          <div className="mx-auto max-w-md text-center mb-8">
            <Alert
              color="info"
              icon={HiInformationCircle}
              className="shadow-md rounded-lg p-4 bg-blue-50"
            >
              <span className="font-medium">Atenção:</span> Disponível somente
              durante o período de votação.
            </Alert>
          </div>

          {/* Botão para Projetos */}
          <div className="text-center">
            <Link
              href="/projetos"
              className="inline-block bg-[#ffb74d] text-white font-semibold text-xl py-3 px-8 rounded-lg shadow-md hover:bg-[#f4a261] hover:scale-105 transition-all duration-300"
            >
              Descubra os projetos em competição
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Projetos
