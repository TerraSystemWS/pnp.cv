import React from "react"
import { usePathname } from "next/navigation" // Import usePathname from Next.js

const UserProfileCard = ({ user }: any) => {
  const pathname = usePathname() // Get the current path using usePathname from Next.js

  // Helper function to check if the link is active
  const isActive = (path: string) => pathname === path

  return (
    <div className="col-span-4 sm:col-span-3">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col items-center">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user
            )}&background=0D8ABC&color=fff&size=200`}
            className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
            alt={`Avatar of ${user}`}
          />
          <h1 className="text-xl font-bold">{user}</h1>
        </div>
        <hr className="my-6 border-t border-gray-300" />
        <div className="flex flex-col p-4 w-64 h-screen">
          <span className="text-yellow-500 uppercase font-bold tracking-wider mb-6">
            Links de Acesso
          </span>
          <ul className="space-y-4">
            <li className="flex items-center mb-2">
              <a
                href="/perfil"
                className={`flex items-center transition duration-200 ${
                  isActive("/perfil")
                    ? "bg-yellow-500 text-white"
                    : "hover:text-yellow-500"
                }`}
              >
                Perfil
              </a>
            </li>
            <li className="flex items-center mb-2">
              <a
                href="/perfil/avaliacao"
                className={`flex items-center transition duration-200 ${
                  isActive("/perfil/avaliacao")
                    ? "bg-yellow-500 text-white"
                    : "hover:text-yellow-500"
                }`}
              >
                Avaliação dos Juris
              </a>
            </li>
            <li className="flex items-center mb-2">
              <a
                href="/perfil/votacaopublicaStatus"
                className={`flex items-center transition duration-200 ${
                  isActive("/perfil/votacaopublicaStatus")
                    ? "bg-yellow-500 text-white"
                    : "hover:text-yellow-500"
                }`}
              >
                Votação Publica
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default UserProfileCard
