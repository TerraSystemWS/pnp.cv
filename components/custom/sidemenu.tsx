import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { FaUserAlt, FaStar, FaVoteYea } from "react-icons/fa" // Adicionando ícones para as opções de menu

const UserProfileCard = ({ user }: any) => {
  const router = useRouter()
  const pathname = router.pathname

  // Função para verificar se o link está ativo
  const isActive = (path: string) => pathname === path

  return (
    <div className="col-span-4 sm:col-span-3">
      <div className="bg-white shadow-xl rounded-lg p-6">
        <div className="flex flex-col items-center">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user
            )}&background=0D8ABC&color=fff&size=200`}
            className="w-32 h-32 bg-gray-300 rounded-full mb-4 border-4 border-yellow-500"
            alt={`Avatar de ${user}`}
          />
          <h1 className="text-2xl font-bold text-gray-900">{user}</h1>
        </div>
        <hr className="my-6 border-t border-gray-300" />
        <div className="flex flex-col p-4 w-64 h-screen bg-gray-50 rounded-lg shadow-lg">
          <span className="text-yellow-500 uppercase font-bold tracking-wider mb-6 text-lg">
            Links de Acesso
          </span>
          <ul className="space-y-6">
            <li className="flex items-center mb-4">
              <Link
                href="/perfil"
                className={`flex items-center p-3 rounded-lg transition duration-300 ease-in-out ${
                  isActive("/perfil")
                    ? "bg-yellow-500 text-white shadow-lg"
                    : "hover:bg-yellow-100 hover:text-yellow-500"
                }`}
              >
                <FaUserAlt className="mr-3 text-xl" />
                <span className="text-sm font-semibold">Perfil</span>
              </Link>
            </li>
            <li className="flex items-center mb-4">
              <Link
                href="/perfil/avaliacao"
                className={`flex items-center p-3 rounded-lg transition duration-300 ease-in-out ${
                  isActive("/perfil/avaliacao")
                    ? "bg-yellow-500 text-white shadow-lg"
                    : "hover:bg-yellow-100 hover:text-yellow-500"
                }`}
              >
                <FaStar className="mr-3 text-xl" />
                <span className="text-sm font-semibold">Avaliar Projetos</span>
              </Link>
            </li>
            {user == "soniarosa" || user == "ailton" ? (
              <>
                <li className="flex items-center mb-4">
                  <Link
                    href="/perfil/votacaopublicaStatus"
                    className={`flex items-center p-3 rounded-lg transition duration-300 ease-in-out ${
                      isActive("/perfil/votacaopublicaStatus")
                        ? "bg-yellow-500 text-white shadow-lg"
                        : "hover:bg-yellow-100 hover:text-yellow-500"
                    }`}
                  >
                    <FaVoteYea className="mr-3 text-xl" />
                    <span className="text-sm font-semibold">
                      Resultado da Votação Pública
                    </span>
                  </Link>
                </li>
                <li className="flex items-center mb-4">
                  <Link
                    href="/perfil/avaliacaoStatus"
                    className={`flex items-center p-3 rounded-lg transition duration-300 ease-in-out ${
                      isActive("/perfil/avaliacaoStatus")
                        ? "bg-yellow-500 text-white shadow-lg"
                        : "hover:bg-yellow-100 hover:text-yellow-500"
                    }`}
                  >
                    <FaVoteYea className="mr-3 text-xl" />
                    <span className="text-sm font-semibold">
                      Resultado da Avaliação do Jurados
                    </span>
                  </Link>
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default UserProfileCard
