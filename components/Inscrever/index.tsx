import Link from "next/link"

const Inscrever = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-[#e6e2d8] via-white to-[#e6e2d8]">
        <div className="mx-auto max-w-7xl py-16 px-6 sm:px-8 lg:px-16">
          <div className="lg:flex lg:items-center lg:justify-between">
            {/* Título */}
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl text-center lg:text-left">
              <span className="block">Pronto para se inscrever?</span>
              <span className="block text-amarelo-ouro text-lg font-semibold mt-2">
                Inscrições abertas de 1 a 31 de Janeiro de 2025
              </span>
            </h2>

            {/* Botões de Ação */}
            <div className="mt-8 flex justify-center lg:justify-start space-x-4">
              {/* Botão Inscrever */}
              <div className="inline-flex rounded-md shadow-xl">
                <Link
                  href="/inscricao"
                  className="inline-flex items-center justify-center rounded-md bg-amarelo-ouro text-white font-medium text-lg py-3 px-8 transition duration-300 ease-in-out transform hover:bg-castanho-claro hover:scale-105"
                >
                  Inscrever
                </Link>
              </div>

              {/* Botão Regulamentos */}
              <div className="inline-flex rounded-md shadow-xl">
                <Link
                  href="/regulamentos"
                  className="inline-flex items-center justify-center rounded-md bg-white text-indigo-600 font-medium text-lg py-3 px-8 transition duration-300 ease-in-out transform hover:bg-indigo-50 hover:scale-105"
                >
                  Regulamentos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Inscrever
